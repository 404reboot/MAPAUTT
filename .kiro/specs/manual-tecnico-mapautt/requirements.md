# Requirements Document

## Introduction

Este documento define los requisitos para la creación de MANUAL_TECNICO.md, un manual técnico integral en español dirigido a desarrolladores y administradores de sistemas del proyecto MAPAUTT. El manual cubre la arquitectura del sistema, requisitos de entorno, instalación, configuración, arquitectura de código, esquema de base de datos con diagramas Mermaid ER, frontend y modelo 3D, endpoints de API REST, autenticación, gestión de archivos, despliegue, mantenimiento y limitaciones conocidas.

## Glossary

- **Manual_Tecnico**: Documento Markdown en español (MANUAL_TECNICO.md) que contiene la documentación técnica completa del sistema MAPAUTT.
- **MAPAUTT**: Sistema de mapa interactivo 3D de la Universidad Tecnológica de Tecamachalco construido con Spring Boot y Three.js.
- **Generador_de_Manual**: Proceso que produce el archivo MANUAL_TECNICO.md en la ruta especificada del proyecto.
- **Diagrama_ER_Mermaid**: Diagrama entidad-relación escrito en sintaxis Mermaid que representa el esquema de la base de datos.
- **Sección**: Cada una de las 12 divisiones temáticas principales del manual técnico.
- **Desarrollador**: Persona con conocimientos técnicos que consulta el manual para comprender, modificar o extender el sistema.
- **Administrador_de_Sistemas**: Persona encargada de instalar, configurar y mantener el sistema en un entorno de producción.

## Requirements

### Requirement 1: Estructura General del Documento

**User Story:** As a Desarrollador, I want a comprehensive technical manual with a clear 12-section structure, so that I can quickly navigate to the information I need.

#### Acceptance Criteria

1. THE Generador_de_Manual SHALL produce a single Markdown file named MANUAL_TECNICO.md at the path /home/dexslender/projects/MAPAUTT/MANUAL_TECNICO.md.
2. THE Manual_Tecnico SHALL contain exactly 12 top-level sections in this order: Descripción general del sistema, Requisitos del entorno de desarrollo, Instalación y configuración, Arquitectura del código, Base de datos, Frontend y modelo 3D, API REST, Autenticación y seguridad, Gestión de archivos (imágenes), Despliegue, Mantenimiento y extensión, Problemas conocidos y limitaciones.
3. THE Manual_Tecnico SHALL be written entirely in Spanish.
4. THE Manual_Tecnico SHALL use Markdown heading levels (## for main sections, ### for subsections) for consistent hierarchy.

### Requirement 2: Descripción General del Sistema

**User Story:** As a Desarrollador, I want a system overview section, so that I can understand the purpose, scope, and technology stack at a glance.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL include a section describing the purpose and scope of the MAPAUTT system.
2. THE Manual_Tecnico SHALL document the technology stack including Spring Boot 4.1.0, Java 25, Maven wrapper, MariaDB, Thymeleaf, Three.js r128.
3. THE Manual_Tecnico SHALL state the exact project versions: Java 25 and Spring Boot 4.1.0.

### Requirement 3: Requisitos del Entorno de Desarrollo

**User Story:** As a Desarrollador, I want to know the exact environment requirements, so that I can set up my development machine correctly.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL list the required JDK version (Java 25), build tool (Maven via wrapper), database server (MariaDB), and any additional tooling.
2. THE Manual_Tecnico SHALL specify operating system compatibility considerations.
3. THE Manual_Tecnico SHALL document IDE recommendations and configuration.

### Requirement 4: Instalación y Configuración

**User Story:** As a Administrador_de_Sistemas, I want step-by-step installation and configuration instructions, so that I can deploy the application from scratch.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL provide step-by-step instructions for cloning the repository, configuring the database, and running the application.
2. THE Manual_Tecnico SHALL document the application.properties configuration parameters including database connection, file upload limits (10MB), and server settings.
3. THE Manual_Tecnico SHALL include instructions for creating the MariaDB database named "mapavutt".

### Requirement 5: Arquitectura del Código

**User Story:** As a Desarrollador, I want a detailed code architecture section, so that I can understand the package organization and class responsibilities.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL document the package structure: app (Main, DatabaseSeeder), controller (LoginController, WelcomeController, AdminPanelController, MapRestController, MapService), model (Edificio, AreaVerde, Especie, Administrator), and JPA repositories.
2. THE Manual_Tecnico SHALL describe the responsibility of each controller, service, and model class.
3. THE Manual_Tecnico SHALL include a description of the MVC pattern as implemented in the project.

### Requirement 6: Base de Datos

**User Story:** As a Desarrollador, I want a complete database schema section with an ER diagram, so that I can understand the data model and relationships.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL document the 5 database tables: administrator, edificio, area_verde, especies, area_verde_especie (many-to-many join table).
2. THE Manual_Tecnico SHALL include a Mermaid ER diagram representing all tables, their columns, and relationships.
3. THE Manual_Tecnico SHALL describe the many-to-many relationship between area_verde and especies through the area_verde_especie join table.
4. THE Manual_Tecnico SHALL document each table's columns with their data types and constraints.

### Requirement 7: Frontend y Modelo 3D

**User Story:** As a Desarrollador, I want documentation of the frontend architecture and 3D model integration, so that I can maintain and extend the user interface.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL document the Thymeleaf template structure including fragments (sidebar, sections, modal).
2. THE Manual_Tecnico SHALL describe the Three.js r128 integration including OrbitControls, GLTFLoader, EffectComposer, and OutlinePass.
3. THE Manual_Tecnico SHALL document the 3D model file location at /static/modelo/Mapa_UTTECAM.glb.
4. THE Manual_Tecnico SHALL explain the GPS coordinate system with origin at Entrada 1 (18.865175, -97.723098) and the linear conversion factors from GPS to 3D coordinates.

### Requirement 8: API REST

**User Story:** As a Desarrollador, I want complete REST API documentation, so that I can integrate with or extend the API endpoints.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL document the endpoint GET /api/map-data including its purpose, parameters, and response format.
2. THE Manual_Tecnico SHALL document the endpoint GET /api/edificios/{codigoMesh} including its purpose, path parameters, and response format.
3. THE Manual_Tecnico SHALL document the endpoint GET /api/areas-verdes/{identifier} including its purpose, path parameters, and response format.
4. THE Manual_Tecnico SHALL describe the JSON response structure for each endpoint.

### Requirement 9: Autenticación y Seguridad

**User Story:** As a Desarrollador, I want documentation of the authentication mechanism, so that I can understand how session handling works in the system.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL document the HttpSession-based authentication mechanism (without Spring Security).
2. THE Manual_Tecnico SHALL describe the login flow handled by LoginController.
3. THE Manual_Tecnico SHALL state that the system uses plaintext passwords as a known limitation without proposing mitigation measures.

### Requirement 10: Gestión de Archivos e Imágenes

**User Story:** As a Desarrollador, I want documentation of the file and image management system, so that I can understand how uploads are handled and stored.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL document the image upload mechanism including the naming convention (timestamp_UUID.ext).
2. THE Manual_Tecnico SHALL specify the storage location at /static/images/custom/.
3. THE Manual_Tecnico SHALL document the maximum file size limit of 10MB.

### Requirement 11: Despliegue

**User Story:** As a Administrador_de_Sistemas, I want deployment instructions, so that I can deploy the application to a production environment.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL provide instructions for building the application as a JAR using the Maven wrapper.
2. THE Manual_Tecnico SHALL document the steps to deploy the application in a production environment.
3. THE Manual_Tecnico SHALL include considerations for configuring the production database and external access.

### Requirement 12: Mantenimiento y Extensión

**User Story:** As a Desarrollador, I want maintenance and extension guides, so that I can add new features or modify existing ones following the established patterns.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL provide guidance on adding new entities (models, repositories, controllers).
2. THE Manual_Tecnico SHALL document the process for adding new 3D building meshes to the map.
3. THE Manual_Tecnico SHALL describe how to extend the REST API with new endpoints.

### Requirement 13: Problemas Conocidos y Limitaciones

**User Story:** As a Desarrollador, I want a clear list of known issues and limitations, so that I am aware of the system's constraints before making changes.

#### Acceptance Criteria

1. THE Manual_Tecnico SHALL list security weaknesses as known limitations only, without proposing mitigation measures.
2. THE Manual_Tecnico SHALL document the plaintext password storage as a known limitation.
3. THE Manual_Tecnico SHALL document the absence of Spring Security as a known limitation.
4. THE Manual_Tecnico SHALL document any other architectural or functional limitations identified in the codebase.
