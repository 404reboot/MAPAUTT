# =========================================================
# MAPAUTT - DOCKERFILE PARA RENDER.COM (JAVA 25)
# =========================================================

# Etapa 1: Compilación del proyecto
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /app

# Copiar Maven Wrapper y pom.xml para aprovechar la caché de capas Docker
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente y construir el paquete ejecutable JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen de ejecución ligera
FROM eclipse-temurin:25-jdk
WORKDIR /app

# Crear directorio necesario para subida de imágenes
RUN mkdir -p uploads/images

# Copiar el JAR desde la etapa de compilación
COPY --from=builder /app/target/mapavutt-0.0.1-SNAPSHOT.jar app.jar

# Puerto por defecto (Render sobreescribirá este valor dinámicamente con la variable $PORT)
EXPOSE 8080

# Iniciar la aplicación Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
