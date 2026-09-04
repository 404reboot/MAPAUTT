# Requirements Document

## Introduction

Este documento define los requisitos para la creación de un manual de usuario (MANUAL.md) de la aplicación MAPAUTT — un mapa 3D interactivo del campus de la Universidad Tecnológica de Tecamachalco. El manual está dirigido a dos roles: usuario general (que explora el mapa) y administrador (que gestiona la información mediante operaciones CRUD). El documento debe estar escrito en español, para una audiencia de nivel intermedio (estudiantes y personal universitario familiarizados con aplicaciones web), y no incluir secciones de instalación o configuración técnica.

## Glossary

- **Manual**: El archivo MANUAL.md que documenta el uso de la aplicación MAPAUTT para usuarios finales.
- **MAPAUTT**: La aplicación web de mapa 3D interactivo del campus de la Universidad Tecnológica de Tecamachalco.
- **Usuario_General**: Persona que accede a la aplicación para explorar el mapa 3D del campus sin privilegios de administración.
- **Administrador**: Persona autenticada que accede al panel de administración para gestionar edificios, áreas verdes y especies.
- **Mapa_3D**: Representación tridimensional del campus renderizada con Three.js a partir de un modelo GLB.
- **Panel_Administrativo**: Interfaz lateral (sidebar) desde la cual el Administrador realiza operaciones CRUD.
- **Marcador_Captura**: Texto con formato `[Captura: descripción]` insertado como indicador de ubicación para futuras capturas de pantalla.
- **Sección**: Cada bloque principal de contenido del Manual (Introducción, Inicio rápido, etc.).
- **Ficha_Detalle**: Tarjeta que aparece al hacer clic en un elemento del mapa mostrando información detallada.
- **Menú_Explorar**: Menú de categorías (Infraestructura, Áreas comunes, Espacios naturales) que filtra elementos visibles en el mapa.

## Requirements

### Requirement 1: Estructura General del Manual

**User Story:** Como coordinador del proyecto, quiero que el manual tenga una estructura clara y completa, para que los usuarios encuentren rápidamente la información que necesitan.

#### Acceptance Criteria

1. THE Manual SHALL contain exactly six top-level sections: Introducción, Inicio rápido, Funcionalidades del Usuario General, Funcionalidades del Administrador, Solución de problemas comunes, and Glosario.
2. THE Manual SHALL be written entirely in Spanish.
3. THE Manual SHALL be saved as a single Markdown file at the path `/home/dexslender/projects/MAPAUTT/MANUAL.md`.
4. THE Manual SHALL use language appropriate for an intermediate audience of university students and staff.
5. THE Manual SHALL NOT include installation, configuration, or deployment instructions.

### Requirement 2: Marcadores de Captura de Pantalla

**User Story:** Como coordinador del proyecto, quiero que el manual incluya indicadores para futuras capturas de pantalla, para que el equipo de documentación sepa dónde insertarlas.

#### Acceptance Criteria

1. THE Manual SHALL include screenshot placeholders using the format `[Captura: descripción]` at each point where a visual reference is appropriate.
2. WHEN a new interface screen or interactive element is described, THE Manual SHALL include at least one Marcador_Captura relevant to that element.

### Requirement 3: Sección de Introducción

**User Story:** Como usuario del manual, quiero una introducción clara del propósito de la aplicación y los roles, para entender qué puedo hacer con MAPAUTT.

#### Acceptance Criteria

1. THE Sección de Introducción SHALL describe the purpose of MAPAUTT as a 3D interactive campus map for Universidad Tecnológica de Tecamachalco.
2. THE Sección de Introducción SHALL define two user roles: Usuario_General and Administrador.
3. THE Sección de Introducción SHALL describe the capabilities available to each role.

### Requirement 4: Sección de Inicio Rápido

**User Story:** Como usuario nuevo, quiero saber cómo iniciar mi interacción con la aplicación, para comenzar a usarla inmediatamente.

#### Acceptance Criteria

1. THE Sección de Inicio Rápido SHALL describe the welcome screen including the mascot display.
2. THE Sección de Inicio Rápido SHALL explain the two entry-point buttons: "Explorar el mapa" and "Panel administrativo".
3. THE Sección de Inicio Rápido SHALL explain that MAPAUTT is accessed through a web browser without special network requirements.
4. WHEN the user selects "Explorar el mapa", THE Sección de Inicio Rápido SHALL describe the loading screen and transition to the Mapa_3D view.

### Requirement 5: Funcionalidades del Mapa 3D para Usuario General

**User Story:** Como Usuario_General, quiero entender cómo interactuar con el mapa 3D, para explorar las instalaciones del campus de forma intuitiva.

#### Acceptance Criteria

1. THE Sección de Funcionalidades del Usuario General SHALL describe the 3D map rendering including the loading screen.
2. THE Sección de Funcionalidades del Usuario General SHALL explain zoom and reset view controls.
3. THE Sección de Funcionalidades del Usuario General SHALL describe the tooltip behavior when hovering over map elements.
4. WHEN the user clicks on a map element, THE Manual SHALL describe the Ficha_Detalle card that appears with detailed information.
5. THE Sección de Funcionalidades del Usuario General SHALL explain the GPS location marker feature.
6. THE Sección de Funcionalidades del Usuario General SHALL describe mobile touch gestures including drag to dismiss and tap to select.
7. THE Sección de Funcionalidades del Usuario General SHALL explain that entrance markers are always visible on the map.

### Requirement 6: Menú Explorar y Filtros

**User Story:** Como Usuario_General, quiero entender el menú de categorías para filtrar lo que veo en el mapa, para encontrar fácilmente los espacios que me interesan.

#### Acceptance Criteria

1. THE Manual SHALL describe the Menú_Explorar with its three categories: Infraestructura, Áreas comunes, and Espacios naturales.
2. WHEN a category is selected in the Menú_Explorar, THE Manual SHALL explain that only elements of that category become highlighted or visible.
3. THE Manual SHALL describe how to navigate between categories and return to the full map view.

### Requirement 7: Información de Edificios en el Mapa

**User Story:** Como Usuario_General, quiero saber qué información se muestra de un edificio, para conocer las carreras y servicios que ofrece.

#### Acceptance Criteria

1. WHEN a building is selected on the Mapa_3D, THE Manual SHALL describe the Ficha_Detalle showing the building name and associated programs (carreras).

### Requirement 8: Información de Áreas Verdes y Especies en el Mapa

**User Story:** Como Usuario_General, quiero ver información de áreas verdes y sus especies, para conocer la biodiversidad del campus.

#### Acceptance Criteria

1. WHEN a green area is selected on the Mapa_3D, THE Manual SHALL describe the Ficha_Detalle showing area name, sector, surface area, description, and associated species tags.
2. WHEN a species detail is viewed, THE Manual SHALL describe the full taxonomy card showing: nombre, reino, división/phylum, clase, subclase, orden, familia, subfamilia, género, especie, variedad, imagen, and observaciones.

### Requirement 9: Autenticación del Administrador

**User Story:** Como Administrador, quiero saber cómo iniciar sesión, para acceder al panel de gestión.

#### Acceptance Criteria

1. THE Manual SHALL describe the login screen with username and password fields.
2. IF invalid credentials are entered, THEN THE Manual SHALL describe the error messages displayed.
3. WHEN authentication is successful, THE Manual SHALL describe the redirect to the Panel_Administrativo.
4. THE Manual SHALL describe how to close the session (cerrar sesión).

### Requirement 10: Panel Administrativo - Estructura General

**User Story:** Como Administrador, quiero entender la interfaz del panel, para poder navegar entre las diferentes secciones de gestión.

#### Acceptance Criteria

1. THE Manual SHALL describe the Panel_Administrativo sidebar containing sections: Edificios, Áreas Verdes, Seres Vivos, and Editor del Mapa (marked with 🚧 as under construction).
2. THE Manual SHALL describe the top bar with the search functionality.
3. THE Manual SHALL describe the "Agregar" button for creating new records.
4. THE Manual SHALL describe the table view displaying records with edit and delete action buttons.
5. THE Manual SHALL describe the modal dialogs used for creating and editing records.

### Requirement 11: Gestión de Edificios

**User Story:** Como Administrador, quiero saber cómo gestionar edificios, para mantener actualizada la información de la infraestructura del campus.

#### Acceptance Criteria

1. THE Manual SHALL describe how to create a new building record with fields: nombre, carreras, and código mesh.
2. THE Manual SHALL describe how to edit an existing building record.
3. THE Manual SHALL describe how to delete a building record.
4. THE Manual SHALL describe how to search for buildings using the top bar search.

### Requirement 12: Gestión de Áreas Verdes

**User Story:** Como Administrador, quiero saber cómo gestionar áreas verdes, para documentar los espacios naturales del campus.

#### Acceptance Criteria

1. THE Manual SHALL describe how to create a new green area record with fields: nombre, sector, superficie, descripción, código mesh, and species tags.
2. THE Manual SHALL describe how to edit an existing green area record.
3. THE Manual SHALL describe how to delete a green area record.
4. THE Manual SHALL describe how to assign species (especies) to a green area using tags.

### Requirement 13: Gestión de Especies (Seres Vivos)

**User Story:** Como Administrador, quiero saber cómo gestionar el catálogo de especies, para mantener el inventario de biodiversidad del campus.

#### Acceptance Criteria

1. THE Manual SHALL describe how to create a new species record with the full taxonomy fields: nombre, reino, división/phylum, clase, subclase, orden, familia, subfamilia, género, especie, variedad, imagen, and observaciones.
2. THE Manual SHALL describe the drag-and-drop image upload functionality for species records.
3. THE Manual SHALL describe how to edit an existing species record.
4. THE Manual SHALL describe how to delete a species record.

### Requirement 14: Sección de Solución de Problemas

**User Story:** Como usuario de cualquier rol, quiero una sección de solución de problemas, para resolver las dificultades más comunes sin asistencia técnica.

#### Acceptance Criteria

1. THE Sección de Solución de Problemas SHALL include common issues related to map loading and 3D rendering.
2. THE Sección de Solución de Problemas SHALL include common issues related to login and authentication errors.
3. THE Sección de Solución de Problemas SHALL include common issues related to GPS location not working.
4. THE Sección de Solución de Problemas SHALL include common issues related to mobile device interaction.
5. WHEN describing a problem, THE Sección de Solución de Problemas SHALL provide at least one recommended solution for each issue listed.

### Requirement 15: Sección de Glosario

**User Story:** Como usuario, quiero un glosario de términos técnicos, para entender el vocabulario utilizado en la aplicación y en el manual.

#### Acceptance Criteria

1. THE Sección de Glosario SHALL define all technical and domain-specific terms used throughout the Manual.
2. THE Sección de Glosario SHALL include terms related to the 3D map interface (mesh, GLB, renderizado, tooltip).
3. THE Sección de Glosario SHALL include terms related to the administrative domain (CRUD, taxonomía, código mesh).
4. THE Sección de Glosario SHALL list terms in alphabetical order.
