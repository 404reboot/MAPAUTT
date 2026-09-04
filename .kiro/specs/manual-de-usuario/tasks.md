# Implementation Plan: Manual de Usuario MAPAUTT

## Overview

Crear el archivo `MANUAL.md` en la raíz del proyecto con la documentación completa de uso de la aplicación MAPAUTT. El documento se escribe en español con tono informal (tú), contiene 6 secciones H2, al menos 15 marcadores `[Captura: ...]`, y cubre los roles de Usuario General y Administrador.

## Tasks

- [x] 1. Crear el archivo MANUAL.md con las secciones 1 y 2
  - [x] 1.1 Crear MANUAL.md con el encabezado H1, la sección de Introducción y la sección de Inicio rápido
    - Crear el archivo `/home/dexslender/projects/MAPAUTT/MANUAL.md`
    - Escribir el título H1: `# Manual de Usuario — MAPAUTT`
    - Sección `## 1. Introducción` con subsecciones: ¿Qué es MAPAUTT? (propósito como mapa 3D interactivo de la UTT) y Roles de usuario (tabla/lista con Usuario General y Administrador y sus capacidades)
    - Incluir `[Captura: Pantalla principal de MAPAUTT mostrando el mapa 3D]`
    - Sección `## 2. Inicio rápido` con subsecciones: Acceder a la aplicación (vía navegador, sin requisitos de red), Pantalla de bienvenida (mascota, botones "Explorar el mapa" y "Panel administrativo"), Elegir tu ruta (pantalla de carga y transición al mapa)
    - Incluir `[Captura: Pantalla de bienvenida con mascota]` y `[Captura: Pantalla de carga del mapa]`
    - Usar tono informal (tú), español, sin contenido de instalación/configuración
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4_

- [x] 2. Escribir la sección de Funcionalidades del Usuario General
  - [x] 2.1 Agregar la sección 3 completa al archivo MANUAL.md
    - Sección `## 3. Funcionalidades del Usuario General`
    - Subsección: El mapa 3D (renderizado, pantalla de carga) con `[Captura: Vista general del mapa 3D cargado]`
    - Subsección: Controles de navegación (zoom scroll/pinch, reset, rotación) con `[Captura: Controles de zoom y reset]`
    - Subsección: Tooltips y fichas de detalle (hover → tooltip, clic → Ficha_Detalle) con `[Captura: Tooltip al pasar el cursor]` y `[Captura: Ficha de detalle de un elemento]`
    - Subsección: Menú Explorar (3 categorías: Infraestructura, Áreas comunes, Espacios naturales; filtrado; volver a vista completa) con `[Captura: Menú Explorar con categorías]`
    - Subsección: Información de edificios (Ficha_Detalle con nombre y carreras) con `[Captura: Ficha de detalle de un edificio]`
    - Subsección: Información de áreas verdes y especies (ficha con nombre, sector, superficie, descripción, tags; tarjeta taxonómica completa con todos los campos) con `[Captura: Ficha de un área verde]` y `[Captura: Tarjeta taxonómica de una especie]`
    - Subsección: Marcador GPS (ubicación en tiempo real) con `[Captura: Marcador GPS activo en el mapa]`
    - Subsección: Uso en dispositivos móviles (gestos táctiles, marcadores de entrada siempre visibles) con `[Captura: Interacción táctil en dispositivo móvil]`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.1, 6.2, 6.3, 7.1, 8.1, 8.2_

- [x] 3. Escribir la sección de Funcionalidades del Administrador
  - [x] 3.1 Agregar la sección 4 completa al archivo MANUAL.md
    - Sección `## 4. Funcionalidades del Administrador`
    - Subsección: Iniciar sesión (campos usuario/contraseña, mensajes de error, redirección al panel) con `[Captura: Pantalla de inicio de sesión]` y `[Captura: Mensaje de error de credenciales]`
    - Subsección: Estructura del panel administrativo (sidebar con Edificios, Áreas Verdes, Seres Vivos, Editor del Mapa 🚧; barra de búsqueda; botón Agregar; tabla con editar/eliminar; modales) con `[Captura: Panel administrativo - vista general]` y `[Captura: Modal de creación/edición]`
    - Subsección: Gestión de edificios (CRUD con campos nombre, carreras, código mesh; búsqueda) con `[Captura: Formulario de edificio]`
    - Subsección: Gestión de áreas verdes (CRUD con campos nombre, sector, superficie, descripción, código mesh, tags de especies) con `[Captura: Formulario de área verde con tags de especies]`
    - Subsección: Gestión de especies/Seres Vivos (CRUD con taxonomía completa, drag-and-drop de imagen) con `[Captura: Formulario de especie]` y `[Captura: Zona de carga de imagen drag-and-drop]`
    - Subsección: Cerrar sesión (ubicación del botón y confirmación)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 12.3, 12.4, 13.1, 13.2, 13.3, 13.4_

- [x] 4. Escribir las secciones de Solución de problemas y Glosario
  - [x] 4.1 Agregar las secciones 5 y 6 al archivo MANUAL.md
    - Sección `## 5. Solución de problemas comunes` con el formato Problema/Síntomas/Solución
    - Categorías: Problemas con el mapa 3D (no carga, pantalla negra, rendimiento), Problemas de inicio de sesión (credenciales incorrectas, sesión expirada), Problemas con GPS (permiso denegado, ubicación imprecisa), Problemas en dispositivos móviles (gestos no responden, pantalla no se ajusta)
    - Cada problema con al menos una solución concreta
    - Sección `## 6. Glosario` en orden alfabético
    - Incluir términos 3D: mesh, GLB, renderizado, tooltip
    - Incluir términos administrativos: CRUD, taxonomía, código mesh
    - Incluir términos de la app: Ficha_Detalle, Menú_Explorar, Panel_Administrativo
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 15.1, 15.2, 15.3, 15.4_

- [x] 5. Checkpoint final
  - Verificar que el archivo MANUAL.md existe en la ruta correcta
  - Verificar que tiene exactamente 6 secciones H2
  - Verificar que contiene al menos 15 marcadores `[Captura: ...]`
  - Verificar que no contiene contenido de instalación/configuración
  - Verificar orden alfabético del glosario
  - Ensure all checks pass, ask the user if questions arise.

## Notes

- El entregable es un único archivo Markdown: `/home/dexslender/projects/MAPAUTT/MANUAL.md`
- No se requiere código ejecutable ni tests — es un documento de documentación pura
- El tono debe ser informal (tú): "Haz clic en...", "Verás que..."
- Convenciones tipográficas: **negrita** para botones/UI, `código` para valores técnicos, *cursiva* para términos del glosario en primera aparición
- Los marcadores de captura van después del párrafo que describe el elemento, nunca dentro de listas numeradas
- No incluir secciones de instalación, configuración ni despliegue

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["3.1"] },
    { "id": 3, "tasks": ["4.1"] }
  ]
}
```
