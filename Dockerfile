# =========================================================
# MAPAUTT - DOCKERFILE MULTI-STAGE OPTIMIZADO PARA RENDER.COM
# =========================================================

# --- ETAPA 1: Compilación del proyecto con JDK 25 ---
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /app

# Copiar Maven Wrapper y pom.xml para aprovechar la caché de capas Docker
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Descargar dependencias en caché
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente y empaquetar la aplicación en archivo JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# --- ETAPA 2: Imagen de ejecución ligera con JRE 25 ---
FROM eclipse-temurin:25-jre AS runner
WORKDIR /app

# Crear usuario no privilegiado por seguridad
RUN addgroup --system spring && adduser --system --ingroup spring spring

# Crear directorio de respaldo para almacenamiento y asignar permisos
RUN mkdir -p uploads/images && chown -R spring:spring /app

# Copiar el artefacto .jar generado desde la etapa builder
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Cambiar al usuario no-root
USER spring

# Ajustes críticos para Render.com (512MB RAM y puerto dinámico)
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError" \
    PORT=8080

EXPOSE 8080

# Iniciar la aplicación enlazando el puerto dinámico asignado por Render.com
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
