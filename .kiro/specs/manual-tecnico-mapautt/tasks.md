# Implementation Plan: Manual Técnico MAPAUTT

## Overview

Creación secuencial del archivo `MANUAL_TECNICO.md` en la raíz del proyecto. El manual consta de 12 secciones H2 escritas en español con tono técnico, incluyendo diagramas Mermaid (componentes y ER), bloques de código con etiquetas de lenguaje, y tablas de referencia. Todas las tareas escriben al mismo archivo por lo que se ejecutan secuencialmente.

## Tasks

- [x] 1. Crear archivo y escribir secciones 1–3 (fundamentos del proyecto)
  - [x] 1.1 Crear MANUAL_TECNICO.md con título, sección 1 (Descripción general del sistema) y sección 2 (Requisitos del entorno de desarrollo)
    - Crear el archivo en `/home/dexslender/projects/MAPAUTT/MANUAL_TECNICO.md`
    - Escribir el encabezado H1 del manual
    - Sección 1: propósito del sistema (mapa interactivo 3D UTTECAM), alcance funcional (visualización 3D, panel CRUD, gestión de especies), stack completo con versiones (Spring Boot 4.1.0, Java 25, Maven wrapper, MariaDB, Thymeleaf, Three.js r128, formato GLB)
    - Sección 2: JDK 25 obligatorio, Maven wrapper incluido (`./mvnw` / `mvnw.cmd`), MariaDB 10.5+, compatibilidad de SO, IDE recomendado (IntelliJ IDEA o VS Code), navegador con WebGL
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

  - [x] 1.2 Escribir sección 3 (Instalación y configuración)
    - Pasos numerados: clonar repositorio, crear BD (`CREATE DATABASE mapavutt;`), configurar `application.properties`, ejecutar `./mvnw spring-boot:run`
    - Bloque de código `properties` documentando cada parámetro: datasource URL, username, password, ddl-auto, max-file-size, thymeleaf.prefix
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 2. Escribir sección 4 (Arquitectura del código)
  - [x] 2.1 Documentar estructura de paquetes, clases y patrón MVC con diagrama de componentes Mermaid
    - Paquete `app`: `Main.java` (`@SpringBootApplication`), `DatabaseSeeder.java`
    - Paquete `controller`: `LoginController`, `WelcomeController`, `AdminPanelController`, `MapRestController`, `MapService` con responsabilidades de cada uno
    - Paquete `model`: entidades JPA (`Edificio`, `AreaVerde`, `Especie`, `Administrator`) y repositorios Spring Data
    - Descripción del patrón MVC: Controller → Service → Repository → Model
    - Incluir diagrama Mermaid `graph TD` de componentes del sistema (cliente, Spring Boot, datos)
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 3. Escribir sección 5 (Base de datos)
  - [x] 3.1 Documentar esquema de base de datos con diagrama ER Mermaid
    - Esquema `mapavutt` en MariaDB, 5 tablas
    - Diagrama Mermaid `erDiagram` con entidades: administrator, edificio, area_verde, especies, area_verde_especie
    - Explicación de relación M:N entre `area_verde` y `especies` vía tabla de unión
    - Tablas con columnas, tipos de datos y restricciones
    - Referencia a `schema.sql` con `spring.sql.init.mode=always`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4. Escribir sección 6 (Frontend y modelo 3D)
  - [x] 4.1 Documentar templates Thymeleaf, Three.js, archivos JS y sistema de coordenadas GPS
    - Templates: `mapa.html`, `admin_panel.html`, `login.html`, `welcome.html`; fragments: `sidebar.html`, `sections.html`, `modal.html`
    - Three.js r128: `OrbitControls`, `GLTFLoader`, `EffectComposer` + `OutlinePass`
    - Archivos JS: `mapa.js`, `ubicacion.js`, `ubicacion-config.js`, `mascota.js`
    - Modelo 3D: `/static/modelo/Mapa_UTTECAM.glb`
    - Sistema GPS: origen Entrada 1 (lat: 18.865175, lon: -97.723098), origen 3D (X=-25, Z=70), factores de conversión
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 5. Escribir secciones 7–8 (API REST y Autenticación)
  - [x] 5.1 Documentar los 3 endpoints REST con tabla, parámetros, respuestas JSON y códigos HTTP
    - Tabla resumen de endpoints: GET `/api/map-data`, GET `/api/edificios/{codigoMesh}`, GET `/api/areas-verdes/{identifier}`
    - Para cada endpoint: propósito, parámetros de ruta, estructura JSON de respuesta, códigos HTTP (200, 404)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 5.2 Documentar autenticación HttpSession y seguridad
    - Mecanismo: `HttpSession` nativa (sin Spring Security)
    - Flujo: GET `/acceso` → POST `/acceso` → validar → `session.setAttribute("user")` → redirect `/admin-panel`
    - Logout: `session.invalidate()` → redirect
    - Protección del panel: verificación de sesión en `AdminPanelController`
    - Limitación: contraseñas en texto plano (sin proponer mitigación)
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 6. Escribir secciones 9–10 (Gestión de archivos y Despliegue)
  - [x] 6.1 Documentar gestión de imágenes
    - Convención de nombres: `{timestamp}_{UUID-8chars}.{ext}`
    - Ubicación: `src/main/resources/static/images/custom/` + duplicación en `target/`
    - Límite: 10MB (`spring.servlet.multipart.max-file-size`)
    - Validación: `contentType` comienza con `image/`
    - Eliminación: borrado de ambas copias
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 6.2 Documentar despliegue
    - Build: `./mvnw clean package -DskipTests`
    - Artefacto: `target/mapavutt-0.0.1-SNAPSHOT.jar`
    - Ejecución: `java -jar target/mapavutt-0.0.1-SNAPSHOT.jar`
    - Configuración producción: cambiar thymeleaf.prefix a classpath, credenciales seguras, puerto/host
    - Consideraciones: proxy reverso (nginx), servicio systemd, respaldos de BD
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 7. Escribir secciones 11–12 (Mantenimiento y Problemas conocidos)
  - [x] 7.1 Documentar mantenimiento y extensión
    - Agregar nueva entidad: clase `@Entity`, interfaz `Repository`, métodos en `MapService`, endpoints en controller
    - Agregar nuevo mesh 3D: incluir en GLB, registrar `codigoMesh` en tabla, asegurar correspondencia de nombres
    - Extender API REST: método en `MapRestController`, `@GetMapping`/`@PostMapping`, inyectar servicio, retornar `ResponseEntity`
    - _Requirements: 12.1, 12.2, 12.3_

  - [x] 7.2 Documentar problemas conocidos y limitaciones
    - Contraseñas en texto plano
    - Sin Spring Security (sin filtros, CSRF, etc.)
    - Imágenes en filesystem del proyecto (no CDN/object storage)
    - `spring.thymeleaf.prefix=file:...` vincula a filesystem en desarrollo
    - No hay validación de entrada robusta en REST
    - No hay paginación en listados
    - Modelo GLB no se regenera automáticamente
    - Solo listado de limitaciones, sin proponer mitigaciones
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 8. Checkpoint final
  - Verificar que el archivo MANUAL_TECNICO.md tiene exactamente 12 secciones H2, jerarquía de encabezados correcta, todos los bloques de código con etiqueta de lenguaje, ambos diagramas Mermaid presentes, y contenido en español.
  - Ensure all structure is correct, ask the user if questions arise.

## Notes

- Todas las tareas escriben al mismo archivo (`MANUAL_TECNICO.md`), por lo que deben ejecutarse secuencialmente
- El idioma del manual es español técnico; se mantienen términos técnicos en inglés (endpoint, repository, mesh, etc.)
- Los diagramas Mermaid deben seguir exactamente la especificación del design.md
- Los bloques de código deben incluir siempre etiqueta de lenguaje (java, properties, bash, sql, mermaid)
- El tono es formal, directo e instructivo

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["3.1"] },
    { "id": 4, "tasks": ["4.1"] },
    { "id": 5, "tasks": ["5.1"] },
    { "id": 6, "tasks": ["5.2"] },
    { "id": 7, "tasks": ["6.1"] },
    { "id": 8, "tasks": ["6.2"] },
    { "id": 9, "tasks": ["7.1"] },
    { "id": 10, "tasks": ["7.2"] }
  ]
}
```
