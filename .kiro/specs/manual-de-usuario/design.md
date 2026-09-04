# Design Document: Manual de Usuario MAPAUTT

## Overview

Este documento define la arquitectura y diseño del archivo `MANUAL.md` — el manual de usuario de la aplicación MAPAUTT. El entregable es un único archivo Markdown ubicado en la raíz del proyecto (`/home/dexslender/projects/MAPAUTT/MANUAL.md`) que documenta el uso de la aplicación para dos roles: Usuario General y Administrador.

El manual no es código ejecutable sino documentación estructurada. El diseño se enfoca en: jerarquía de encabezados, organización del contenido, posicionamiento de marcadores de captura, y guías de estilo para consistencia.

## Architecture

### Estructura del Documento

El archivo `MANUAL.md` sigue una jerarquía de encabezados Markdown estándar:

```
# Manual de Usuario — MAPAUTT          (H1: título único del documento)
## Sección Principal                    (H2: las 6 secciones obligatorias)
### Subsección                          (H3: agrupaciones temáticas dentro de cada sección)
#### Detalle                            (H4: pasos específicos o campos de formulario)
```

### Mapa de Secciones

```
MANUAL.md
├── # Manual de Usuario — MAPAUTT
├── ## 1. Introducción
│   ├── ### ¿Qué es MAPAUTT?
│   └── ### Roles de usuario
├── ## 2. Inicio rápido
│   ├── ### Acceder a la aplicación
│   ├── ### Pantalla de bienvenida
│   └── ### Elegir tu ruta
├── ## 3. Funcionalidades del Usuario General
│   ├── ### El mapa 3D
│   ├── ### Controles de navegación
│   ├── ### Tooltips y fichas de detalle
│   ├── ### Menú Explorar
│   ├── ### Información de edificios
│   ├── ### Información de áreas verdes y especies
│   ├── ### Marcador GPS
│   └── ### Uso en dispositivos móviles
├── ## 4. Funcionalidades del Administrador
│   ├── ### Iniciar sesión
│   ├── ### Estructura del panel administrativo
│   ├── ### Gestión de edificios
│   ├── ### Gestión de áreas verdes
│   ├── ### Gestión de especies (Seres Vivos)
│   └── ### Cerrar sesión
├── ## 5. Solución de problemas comunes
│   ├── ### Problemas con el mapa 3D
│   ├── ### Problemas de inicio de sesión
│   ├── ### Problemas con GPS
│   └── ### Problemas en dispositivos móviles
└── ## 6. Glosario
```

## Components

### Componente 1: Bloque Introductorio (Secciones 1–2)

**Responsabilidad:** Orientar al lector sobre qué es MAPAUTT, quiénes lo usan y cómo empezar.

**Contenido de Sección 1 — Introducción:**
- Párrafo describiendo MAPAUTT como mapa 3D interactivo del campus de la UTT
- Tabla o lista con los dos roles y sus capacidades resumidas
- `[Captura: Pantalla principal de MAPAUTT mostrando el mapa 3D]`

**Contenido de Sección 2 — Inicio Rápido:**
- Indicación de que se accede via navegador web sin requisitos especiales de red
- Descripción de la pantalla de bienvenida con la mascota
- Explicación de los dos botones: "Explorar el mapa" y "Panel administrativo"
- Descripción de la pantalla de carga y transición al mapa
- Marcadores: `[Captura: Pantalla de bienvenida con mascota]`, `[Captura: Pantalla de carga del mapa]`

### Componente 2: Funcionalidades del Usuario General (Sección 3)

**Responsabilidad:** Documentar toda la interacción del usuario con el mapa 3D.

**Subsecciones y contenido:**

| Subsección | Contenido clave | Marcador de captura |
|---|---|---|
| El mapa 3D | Renderizado 3D, modelo GLB, pantalla de carga | `[Captura: Vista general del mapa 3D cargado]` |
| Controles de navegación | Zoom (scroll/pinch), reset de vista, rotación | `[Captura: Controles de zoom y reset]` |
| Tooltips y fichas de detalle | Hover → tooltip con nombre; clic → Ficha_Detalle | `[Captura: Tooltip al pasar el cursor]`, `[Captura: Ficha de detalle de un elemento]` |
| Menú Explorar | 3 categorías: Infraestructura, Áreas comunes, Espacios naturales; filtrado | `[Captura: Menú Explorar con categorías]` |
| Información de edificios | Ficha_Detalle con nombre y carreras | `[Captura: Ficha de detalle de un edificio]` |
| Áreas verdes y especies | Ficha con nombre, sector, superficie, descripción, tags de especies; tarjeta taxonómica completa | `[Captura: Ficha de un área verde]`, `[Captura: Tarjeta taxonómica de una especie]` |
| Marcador GPS | Ubicación en tiempo real del usuario sobre el mapa | `[Captura: Marcador GPS activo en el mapa]` |
| Uso en dispositivos móviles | Gestos táctiles: arrastrar para descartar, tap para seleccionar; marcadores de entrada siempre visibles | `[Captura: Interacción táctil en dispositivo móvil]` |

### Componente 3: Funcionalidades del Administrador (Sección 4)

**Responsabilidad:** Documentar el flujo de autenticación y las operaciones CRUD del panel.

**Subsecciones:**

**Iniciar sesión:**
- Campos: usuario y contraseña
- Mensajes de error por credenciales inválidas
- Redirección al panel tras autenticación exitosa
- Marcadores: `[Captura: Pantalla de inicio de sesión]`, `[Captura: Mensaje de error de credenciales]`

**Estructura del panel administrativo:**
- Sidebar con secciones: Edificios, Áreas Verdes, Seres Vivos, Editor del Mapa (🚧)
- Barra superior con búsqueda
- Botón "Agregar" para nuevos registros
- Vista de tabla con botones de editar/eliminar
- Diálogos modales para crear/editar
- Marcadores: `[Captura: Panel administrativo - vista general]`, `[Captura: Modal de creación/edición]`

**Gestión de edificios:**
- Crear: campos nombre, carreras, código mesh
- Editar: abrir modal con datos precargados
- Eliminar: confirmación y eliminación
- Buscar: filtrado por barra superior
- Marcador: `[Captura: Formulario de edificio]`

**Gestión de áreas verdes:**
- Crear: campos nombre, sector, superficie, descripción, código mesh, tags de especies
- Editar y eliminar: flujo análogo a edificios
- Asignación de especies mediante tags
- Marcador: `[Captura: Formulario de área verde con tags de especies]`

**Gestión de especies (Seres Vivos):**
- Crear: campos de taxonomía completa (nombre, reino, división/phylum, clase, subclase, orden, familia, subfamilia, género, especie, variedad, imagen, observaciones)
- Carga de imagen por drag-and-drop
- Editar y eliminar
- Marcadores: `[Captura: Formulario de especie]`, `[Captura: Zona de carga de imagen drag-and-drop]`

**Cerrar sesión:**
- Ubicación del botón y confirmación del cierre

### Componente 4: Solución de Problemas (Sección 5)

**Responsabilidad:** Proveer soluciones prácticas para problemas comunes.

**Formato por entrada:**
```markdown
#### Problema: [Descripción breve del problema]

**Síntomas:** Qué observa el usuario.

**Solución:**
1. Paso concreto para resolver.
2. Paso alternativo si el primero no funciona.
```

**Categorías obligatorias:**
1. Problemas con el mapa 3D (no carga, se ve negro, rendimiento lento)
2. Problemas de inicio de sesión (credenciales incorrectas, sesión expirada)
3. Problemas con GPS (permiso denegado, ubicación imprecisa)
4. Problemas en dispositivos móviles (gestos no responden, pantalla no se ajusta)

### Componente 5: Glosario (Sección 6)

**Responsabilidad:** Definir todos los términos técnicos y de dominio usados en el manual.

**Formato:**
```markdown
- **Término**: Definición concisa en español.
```

**Requisitos:**
- Orden alfabético estricto
- Incluir términos de interfaz 3D: mesh, GLB, renderizado, tooltip
- Incluir términos administrativos: CRUD, taxonomía, código mesh
- Incluir términos de la aplicación: Ficha_Detalle, Menú_Explorar, Panel_Administrativo

## Interfaces

No aplica — el entregable es un archivo Markdown estático sin interfaces programáticas. La "interfaz" del manual es su estructura de navegación vía encabezados y la tabla de contenidos implícita de Markdown.

## Data Models

### Modelo de un Marcador de Captura

```
Formato: [Captura: {descripción}]
Reglas:
  - descripción: texto en español, descriptivo del contenido visual esperado
  - Ubicación: inmediatamente después del párrafo que describe el elemento visual
  - Mínimo: uno por pantalla o elemento interactivo nuevo descrito
```

### Modelo de una Entrada de Solución de Problemas

```
Estructura:
  - título: descripción breve del problema
  - síntomas: qué experimenta el usuario
  - solución: lista numerada de pasos (mínimo 1 paso)
```

### Modelo de una Entrada de Glosario

```
Estructura:
  - término: palabra o frase técnica (negrita)
  - definición: explicación concisa en español
  - ordenamiento: alfabético por término
```

## Error Handling

No aplica en el sentido tradicional (no hay código ejecutable). Sin embargo, el manual documenta situaciones de error de la aplicación:

- **Errores de autenticación:** El manual describe los mensajes mostrados al usuario cuando las credenciales son incorrectas.
- **Errores de carga del mapa:** La sección de solución de problemas cubre escenarios donde el mapa 3D no renderiza correctamente.
- **Errores de GPS:** Se documentan los casos donde el navegador deniega permisos de ubicación o la señal es imprecisa.

## Guías de Estilo para Consistencia

### Tono y Voz
- Segunda persona informal (tú): "Haz clic en...", "Verás que..."
- Oraciones cortas y directas
- Evitar jerga técnica innecesaria (cuando se usa, referenciar al glosario)
- Tono neutro, informativo, no condescendiente

### Convenciones Tipográficas
- **Negrita** para nombres de botones y elementos de UI: **Explorar el mapa**, **Agregar**
- `Código inline` para valores técnicos: `código mesh`, rutas
- *Cursiva* para términos definidos en el glosario en su primera aparición

### Estructura de Instrucciones Paso a Paso
```markdown
1. Haz clic en **Nombre del botón**.
2. Completa el campo **Nombre del campo**.
3. Presiona **Guardar** para confirmar.

[Captura: Descripción de lo que se ve en pantalla]
```

### Posicionamiento de Marcadores de Captura
- Después del párrafo o lista que describe el elemento visual
- Nunca dentro de una lista numerada (siempre después)
- Uno por concepto visual nuevo — no repetir para el mismo elemento en la misma subsección

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Document Structure Integrity

*For any* valid MANUAL.md, the document SHALL contain exactly six H2-level sections with titles matching: "Introducción", "Inicio rápido", "Funcionalidades del Usuario General", "Funcionalidades del Administrador", "Solución de problemas comunes", and "Glosario", in that order.

**Validates: Requirements 1.1**

### Property 2: Technical Content Exclusion

*For any* valid MANUAL.md, the document SHALL NOT contain keywords associated with installation, configuration, or deployment instructions (e.g., "npm install", "mvn", "docker", "configurar servidor", "desplegar", "application.properties", "spring.datasource").

**Validates: Requirements 1.5**

### Property 3: Capture Marker Format Compliance

*For any* occurrence of a capture marker in MANUAL.md, it SHALL match the regex pattern `\[Captura: .+\]` — and the document SHALL contain at least 15 such markers distributed across the six sections.

**Validates: Requirements 2.1, 2.2**

### Property 4: Introduction Section Completeness

*For any* valid MANUAL.md, the Introducción section SHALL contain references to: the purpose as "mapa 3D interactivo", "Universidad Tecnológica de Tecamachalco" (or "UTT"), and explicit definitions of both roles "Usuario General" and "Administrador" with their respective capabilities.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Quick Start Section Completeness

*For any* valid MANUAL.md, the Inicio Rápido section SHALL contain: reference to "navegador web" (browser access), "mascota" (mascot), the button labels "Explorar el mapa" and "Panel administrativo", and description of the loading/transition screen.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 6: General User Section Completeness

*For any* valid MANUAL.md, the Funcionalidades del Usuario General section SHALL document all interactive features: zoom controls, reset view, tooltip on hover, Ficha_Detalle on click, GPS marker, mobile touch gestures (arrastrar/tap), entrance markers always visible, Menú Explorar with three categories (Infraestructura, Áreas comunes, Espacios naturales), building detail with "carreras", and green area detail with taxonomy fields (nombre, reino, división, clase, subclase, orden, familia, subfamilia, género, especie, variedad, imagen, observaciones).

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.1, 6.2, 6.3, 7.1, 8.1, 8.2**

### Property 7: Administrator Section Completeness

*For any* valid MANUAL.md, the Funcionalidades del Administrador section SHALL document: login form (usuario/contraseña), error messages for invalid credentials, redirect to panel, session logout, sidebar sections (Edificios, Áreas Verdes, Seres Vivos, Editor del Mapa 🚧), search bar, "Agregar" button, table view with edit/delete, modal dialogs, and full CRUD operations for buildings (nombre, carreras, código mesh), green areas (nombre, sector, superficie, descripción, código mesh, species tags), and species (full taxonomy + drag-and-drop image upload).

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 13.4**

### Property 8: Troubleshooting Problem-Solution Pairing

*For any* problem entry in the Solución de Problemas section, there SHALL exist at least one associated solution step. The section SHALL contain entries covering: map loading/3D rendering issues, login/authentication errors, GPS location failures, and mobile device interaction problems.

**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

### Property 9: Glossary Completeness and Alphabetical Order

*For any* valid MANUAL.md, the Glosario section SHALL: (a) define terms related to the 3D interface (mesh, GLB, renderizado, tooltip), (b) define terms related to administration (CRUD, taxonomía, código mesh), and (c) list all terms in strict alphabetical order such that for consecutive terms T_i and T_j, T_i.toLowerCase() <= T_j.toLowerCase().

**Validates: Requirements 15.1, 15.2, 15.3, 15.4**
