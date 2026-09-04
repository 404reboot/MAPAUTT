# Manual de Usuario — MAPAUTT

## 1. Introducción

### ¿Qué es MAPAUTT?

MAPAUTT es un *mapa 3D interactivo* del campus de la Universidad Tecnológica de Tecamachalco (UTT). La aplicación te permite explorar las instalaciones del campus de forma visual e intuitiva desde tu navegador web: edificios, áreas verdes, espacios comunes y la biodiversidad que habita en ellos.

El modelo tridimensional del campus se renderiza usando tecnología *Three.js* a partir de un archivo *GLB*, lo que te ofrece una experiencia inmersiva para conocer y navegar por los diferentes espacios universitarios.

[Captura: Pantalla principal de MAPAUTT mostrando el mapa 3D]

### Roles de usuario

MAPAUTT contempla dos roles con diferentes capacidades:

| Rol | Descripción | Capacidades |
|-----|-------------|-------------|
| **Usuario General** | Cualquier persona que accede a la aplicación para explorar el campus. | Navegar el mapa 3D, consultar información de edificios y áreas verdes, usar filtros por categoría, ver fichas de detalle, utilizar el marcador GPS. |
| **Administrador** | Personal autorizado que gestiona la información del campus. | Iniciar sesión en el *Panel Administrativo*, crear/editar/eliminar edificios, gestionar áreas verdes y sus especies, administrar el catálogo de biodiversidad. |

No necesitas una cuenta para explorar el mapa como Usuario General. El acceso al Panel Administrativo sí requiere autenticación con usuario y contraseña.

## 2. Inicio rápido

### Acceder a la aplicación

Para usar MAPAUTT solo necesitas un navegador web actualizado (Chrome, Firefox, Safari o Edge). No se requiere instalar ningún programa adicional ni estar conectado a una red especial — basta con tener acceso a internet y abrir la dirección de la aplicación en tu navegador.

### Pantalla de bienvenida

Al ingresar a MAPAUTT, verás la pantalla de bienvenida. En ella se muestra la mascota de la aplicación (una ardilla representativa de la UTT) junto con un mensaje de saludo y dos botones principales:

- **Explorar el mapa** — Te lleva directamente al mapa 3D interactivo del campus.
- **Panel administrativo** — Te dirige a la pantalla de inicio de sesión para acceder a las herramientas de gestión (solo personal autorizado).

Debajo encontrarás una breve descripción de las funcionalidades que ofrece MAPAUTT.

[Captura: Pantalla de bienvenida con mascota]

### Elegir tu ruta

Dependiendo de lo que necesites hacer, elige uno de los dos botones:

1. Si seleccionas **Explorar el mapa**, verás una pantalla de carga con el mensaje "Cargando Mapa 3D UTTECAM..." mientras se descarga el modelo tridimensional del campus. Una vez que el modelo termina de cargar, la pantalla de carga desaparece y se presenta el mapa 3D completo listo para que lo explores.

2. Si seleccionas **Panel administrativo**, serás dirigido a la pantalla de inicio de sesión donde deberás ingresar tus credenciales de administrador.

[Captura: Pantalla de carga del mapa]

## 3. Funcionalidades del Usuario General

### El mapa 3D

Una vez que seleccionas **Explorar el mapa** desde la pantalla de bienvenida, se muestra una pantalla de carga con el texto "Cargando Mapa 3D UTTECAM..." mientras la aplicación descarga el modelo tridimensional del campus. Este modelo está en formato *GLB* y se *renderiza* en tu navegador usando la librería Three.js.

Cuando la carga finaliza, la pantalla de espera desaparece y verás el mapa 3D completo del campus de la UTT. El modelo incluye edificios, áreas verdes, canchas, estacionamientos y todos los espacios del campus representados en tres dimensiones.

[Captura: Vista general del mapa 3D cargado]

### Controles de navegación

Para moverte por el mapa 3D tienes los siguientes controles:

- **Zoom (acercar/alejar):** Usa la rueda del ratón (scroll) para acercarte o alejarte del mapa. En dispositivos táctiles, utiliza el gesto de pellizcar (pinch) con dos dedos.
- **Rotación:** Mantén presionado el botón izquierdo del ratón y arrastra para rotar la vista del mapa. En pantallas táctiles, arrastra con un dedo.
- **Botones de zoom:** En la esquina inferior del mapa encontrarás los botones **➕** (acercar) y **➖** (alejar) que puedes usar como alternativa al scroll.
- **Restablecer vista:** El botón **🏠** regresa la cámara a su posición original, útil cuando te has alejado demasiado o quieres volver a la vista panorámica del campus.

[Captura: Controles de zoom y reset]

### Tooltips y fichas de detalle

Al interactuar con los elementos del mapa, hay dos niveles de información:

**Tooltip (información rápida):**
Cuando pasas el cursor sobre un elemento del mapa (edificio, área verde, zona), aparece un *tooltip* flotante con el nombre del elemento. Esto te permite identificar rápidamente qué estás viendo sin necesidad de hacer clic.

[Captura: Tooltip al pasar el cursor]

**Ficha de detalle (información completa):**
Cuando haces clic en un elemento, se abre la *Ficha_Detalle* — una tarjeta lateral que muestra información detallada del elemento seleccionado. El elemento clicado se resalta con un contorno luminoso para que sepas cuál tienes seleccionado. Para cerrar la ficha, presiona el botón **✕** en la esquina superior de la tarjeta.

[Captura: Ficha de detalle de un elemento]

### Menú Explorar

El *Menú_Explorar* te permite filtrar los elementos visibles en el mapa por categorías. Para abrirlo, haz clic en el botón **🔍 Explorar** ubicado en la parte superior del mapa.

Al desplegarse, verás tres categorías:

1. **🏢 Infraestructura** — Muestra edificios, laboratorios, bibliotecas, cafeterías y otras construcciones del campus.
2. **👥 Áreas comunes** — Muestra zonas recreativas, canchas, pasillos y estacionamientos.
3. **🌿 Espacios naturales** — Muestra áreas verdes, huertas, invernaderos y presas.

Cuando seleccionas una categoría, los elementos correspondientes se destacan en el mapa mediante etiquetas visibles. Puedes activar varias categorías simultáneamente. Para volver a la vista completa sin filtros, simplemente desmarca todas las categorías haciendo clic nuevamente sobre ellas.

> **Nota:** Los marcadores de entradas del campus siempre permanecen visibles en el mapa, independientemente de las categorías que tengas activas.

[Captura: Menú Explorar con categorías]

### Información de edificios

Cuando haces clic en un edificio del mapa, la *Ficha_Detalle* muestra:

- **Nombre del edificio** — El título principal de la ficha.
- **Carreras** — Las carreras o programas académicos que se imparten en ese edificio.

Esta información te permite conocer rápidamente qué se encuentra en cada construcción del campus sin necesidad de recorrerlo físicamente.

[Captura: Ficha de detalle de un edificio]

### Información de áreas verdes y especies

Cuando seleccionas un área verde en el mapa, la *Ficha_Detalle* muestra la siguiente información:

- **Nombre** del área verde.
- **Sector** donde se ubica dentro del campus.
- **Superficie** del área en metros cuadrados.
- **Descripción** general del espacio.
- **Tags de especies** — Etiquetas que representan las especies (seres vivos) presentes en esa área. Puedes hacer clic en cada tag para ver la información completa de la especie.

[Captura: Ficha de un área verde]

**Tarjeta taxonómica de una especie:**

Al hacer clic en un tag de especie, se muestra una tarjeta con la clasificación taxonómica completa del ser vivo. Los campos que incluye son:

| Campo | Descripción |
|-------|-------------|
| Nombre | Nombre común de la especie |
| Reino | Clasificación a nivel de reino (Plantae, Animalia, etc.) |
| División/Phylum | Grupo taxonómico amplio |
| Clase | Clasificación de clase |
| Subclase | Subdivisión de la clase |
| Orden | Orden taxonómico |
| Familia | Familia biológica |
| Subfamilia | Subdivisión de la familia |
| Género | Género de la especie |
| Especie | Nombre científico específico |
| Variedad | Variedad o subespecie (si aplica) |
| Imagen | Fotografía o ilustración de la especie |
| Observaciones | Notas adicionales sobre la especie en el campus |

La tarjeta incluye un botón para volver a la ficha del área verde desde donde accediste.

[Captura: Tarjeta taxonómica de una especie]

### Marcador GPS

MAPAUTT puede mostrar tu ubicación en tiempo real sobre el mapa 3D del campus. Para activar esta función:

1. Haz clic en el botón **📍 Mi ubicación** ubicado en la parte superior del mapa.
2. Tu navegador te pedirá permiso para acceder a tu ubicación — acepta para continuar.
3. Una vez activado, verás un marcador que indica tu posición actual sobre el modelo 3D del campus.

El marcador se actualiza en tiempo real conforme te desplazas, permitiéndote orientarte dentro del campus y saber exactamente dónde te encuentras en relación con los edificios y áreas del mapa.

[Captura: Marcador GPS activo en el mapa]

### Uso en dispositivos móviles

MAPAUTT está diseñado para funcionar en dispositivos móviles (teléfonos y tablets). Los gestos táctiles disponibles son:

- **Arrastrar para descartar** — Cuando la ficha de detalle está abierta, puedes arrastrarla hacia abajo para cerrarla rápidamente.
- **Tap para seleccionar** — Toca un elemento del mapa para abrir su ficha de detalle, equivalente al clic en escritorio.
- **Pellizcar (pinch)** — Acerca o aleja la vista del mapa con dos dedos.
- **Arrastrar con un dedo** — Rota la vista del mapa.

Los marcadores de entrada del campus siempre permanecen visibles en el mapa sin importar el nivel de zoom o las categorías activas, para que puedas ubicar fácilmente los accesos al campus en cualquier momento.

[Captura: Interacción táctil en dispositivo móvil]

## 4. Funcionalidades del Administrador

### Iniciar sesión

Para acceder al *Panel Administrativo*, necesitas credenciales de administrador. Desde la pantalla de bienvenida, haz clic en **Panel administrativo** o navega directamente a la pantalla de inicio de sesión.

La pantalla de inicio de sesión muestra el logotipo de MAPAUTT, un mensaje de bienvenida y el formulario de acceso con dos campos:

1. **Nombre de usuario** — Escribe tu usuario asignado.
2. **Contraseña** — Escribe tu contraseña.

Una vez que completes ambos campos, presiona el botón **Entrar al panel** para autenticarte.

[Captura: Pantalla de inicio de sesión]

**Si las credenciales son incorrectas:**

El sistema mostrará un mensaje de error en color rojo con el texto "Nombre de usuario o contraseña incorrectos." Verifica que tu usuario y contraseña estén escritos correctamente (recuerda que la contraseña distingue mayúsculas de minúsculas) e intenta nuevamente.

Si intentas acceder al panel sin haber iniciado sesión, verás el mensaje "Acceso denegado. Por favor, inicia sesión."

[Captura: Mensaje de error de credenciales]

**Si las credenciales son correctas:**

Serás redirigido automáticamente al *Panel Administrativo*, donde podrás gestionar la información del campus.

### Estructura del panel administrativo

El Panel Administrativo tiene una interfaz dividida en dos áreas principales: el *sidebar* de navegación y el área de trabajo.

**Sidebar (barra lateral):**

En la parte izquierda encontrarás el menú de navegación con las siguientes secciones:

- **Gestionar Edificios** — Administra la información de los edificios del campus.
- **Gestionar áreas verdes** — Administra las áreas verdes y sus especies asociadas.
- **Gestionar seres vivos** — Administra el catálogo de biodiversidad (especies).
- **Editor del mapa** 🚧 — Sección en construcción para editar el modelo 3D (no disponible actualmente).

En la parte inferior del sidebar encontrarás los enlaces **Volver al Inicio** (para regresar a la pantalla de bienvenida) y **Cerrar Sesión** (para terminar tu sesión).

**Barra superior:**

En la parte superior del área de trabajo hay una barra de navegación que muestra:

- Un *breadcrumb* indicando la sección activa (por ejemplo: Admin / Edificios).
- Un campo de **búsqueda** para filtrar los registros de la sección actual. Al escribir en este campo, la tabla se filtra en tiempo real mostrando solo los registros que coincidan con tu texto.
- El botón **Agregar** para crear nuevos registros en la sección activa.

**Área de contenido (tabla de registros):**

Cada sección muestra los registros existentes en una tabla. Cada fila de la tabla contiene la información del registro y dos botones de acción:

- **Editar** — Abre un diálogo modal con los datos del registro precargados para que los modifiques.
- **Eliminar** — Abre un diálogo de confirmación antes de borrar el registro.

**Diálogos modales:**

Cuando creas o editas un registro, se abre un diálogo modal sobre la pantalla con el formulario correspondiente. El modal incluye un botón **Guardar** (o **Guardar Cambios** al editar) y un botón **Cancelar** para cerrar sin guardar. Para cerrar el modal también puedes hacer clic en el botón **✕** de la esquina superior.

[Captura: Panel administrativo - vista general]

[Captura: Modal de creación/edición]

### Gestión de edificios

En la sección **Gestionar Edificios** puedes crear, editar, eliminar y buscar edificios del campus.

#### Crear un edificio

1. Haz clic en el botón **Agregar** en la barra superior.
2. Se abrirá el modal "Agregar Nuevo Edificio" con los siguientes campos:
   - **Identificador del Mapa 3D** (`código mesh`) — El código que vincula el edificio con su representación en el modelo 3D. Ejemplo: `E`.
   - **Nombre Público** — El nombre visible del edificio. Ejemplo: "Edificio Central".
   - **Carrera / Uso** — Las carreras o el uso asignado al edificio. Ejemplo: "Sistemas".
3. Completa todos los campos (son obligatorios) y presiona **Guardar**.

[Captura: Formulario de edificio]

#### Editar un edificio

1. En la tabla de edificios, localiza el registro que deseas modificar.
2. Haz clic en el botón **Editar** de esa fila.
3. Se abrirá el modal "Editar Edificio" con los datos actuales precargados.
4. Modifica los campos que necesites y presiona **Guardar Cambios**.

#### Eliminar un edificio

1. En la tabla de edificios, haz clic en el botón **Eliminar** del registro que deseas borrar.
2. Aparecerá un diálogo de confirmación con el mensaje: "¿Seguro que deseas eliminar el edificio «nombre»?"
3. Presiona **Eliminar** para confirmar o **Cancelar** para volver sin borrar nada.

> **Nota:** La eliminación no se puede deshacer. Asegúrate de que realmente deseas eliminar el registro antes de confirmar.

#### Buscar edificios

Usa el campo de búsqueda en la barra superior para filtrar edificios. Al escribir, la tabla se actualiza en tiempo real mostrando solo los registros cuyo contenido coincida con tu texto de búsqueda.

### Gestión de áreas verdes

En la sección **Gestionar áreas verdes** puedes administrar los espacios naturales del campus y asignarles especies.

#### Crear un área verde

1. Haz clic en el botón **Agregar** en la barra superior.
2. Se abrirá el modal "Agregar Nueva Área Verde" con los siguientes campos:
   - **Identificador del Mapa 3D** (`código mesh`) — El código que vincula el área con el modelo 3D. Ejemplo: `Jardin_Norte`.
   - **Nombre del Área** — El nombre del espacio. Ejemplo: "Jardín Principal".
   - **Sector / Ubicación** — La zona del campus donde se encuentra. Ejemplo: "Zona Este".
   - **Superficie (m²)** — El área en metros cuadrados. Ejemplo: `450.5`.
   - **Descripción** — Una descripción opcional del espacio.
3. Completa los campos obligatorios y presiona **Guardar**.

[Captura: Formulario de área verde con tags de especies]

#### Editar un área verde

1. Localiza el área verde en la tabla y haz clic en **Editar**.
2. El modal "Editar Área Verde" se abrirá con los datos actuales.
3. Modifica los campos necesarios y presiona **Guardar Cambios**.

#### Eliminar un área verde

1. Haz clic en **Eliminar** junto al área verde que deseas borrar.
2. Confirma la eliminación en el diálogo que aparece.

#### Asignar especies a un área verde

Para asociar especies (seres vivos) a un área verde:

1. En la fila del área verde, haz clic en el botón para asignar una especie.
2. Se abrirá el diálogo "Asignar Especie a «nombre del área»" con un campo de búsqueda desplegable.
3. Escribe el nombre de la especie o haz clic para ver la lista completa de especies disponibles.
4. Selecciona la especie deseada de la lista.
5. Presiona **Asignar Especie** para confirmar.

Las especies asignadas aparecen como *tags* (etiquetas) asociadas al área verde. Para quitar una especie del área, haz clic en el botón de eliminar junto al tag correspondiente. La especie seguirá existiendo en el catálogo general de seres vivos — solo se desvincula del área verde.

> **Nota:** Si no hay especies registradas en el sistema, el diálogo te mostrará un aviso indicando que primero debes agregar especies en la sección **Seres Vivos**.

### Gestión de especies (Seres Vivos)

En la sección **Gestionar seres vivos** puedes administrar el catálogo completo de biodiversidad del campus.

#### Crear una especie

1. Haz clic en el botón **Agregar Especie** en la barra superior.
2. Se abrirá el modal "Agregar Nueva Especie" con los campos de clasificación *taxonómica*:
   - **Nombre Común** (obligatorio) — El nombre popular de la especie. Ejemplo: "Jacaranda".
   - **Reino** (obligatorio) — Selecciona entre: Plantae, Animalia, Fungi u Otro.
   - **División / Phylum** — Grupo taxonómico amplio. Ejemplo: "Magnoliophyta".
   - **Clase** — Clasificación de clase. Ejemplo: "Magnoliopsida".
   - **Subclase** — Subdivisión de la clase.
   - **Orden** — Orden taxonómico. Ejemplo: "Lamiales".
   - **Familia** — Familia biológica. Ejemplo: "Bignoniaceae".
   - **Subfamilia** — Subdivisión de la familia.
   - **Género** — Género de la especie. Ejemplo: "Jacaranda".
   - **Especie** — Nombre científico específico. Ejemplo: "mimosifolia".
   - **Variedad** — Variedad o subespecie, si aplica. Ejemplo: "alba".
   - **Observaciones / Notas** — Detalles adicionales sobre ubicación, hábitos o notas biológicas.
   - **Imagen del Espécimen** — Fotografía o ilustración de la especie (ver carga de imagen abajo).
3. Completa al menos los campos obligatorios (nombre y reino) y presiona **Guardar**.

[Captura: Formulario de especie]

#### Carga de imagen por drag-and-drop

El formulario de especies incluye una zona de carga de imagen con funcionalidad de arrastrar y soltar:

- **Arrastra y suelta** un archivo de imagen desde tu computadora directamente sobre la zona indicada con el texto "Arrastra y suelta una imagen aquí".
- Alternativamente, haz clic en la zona o en el enlace **explora tus archivos** para abrir el selector de archivos de tu sistema.
- Formatos soportados: JPG, PNG, WEBP, GIF (máximo 5 MB).
- Una vez cargada la imagen, verás una vista previa dentro de la zona. Puedes eliminarla haciendo clic en el botón de eliminar (ícono de papelera) que aparece sobre la vista previa.

[Captura: Zona de carga de imagen drag-and-drop]

#### Editar una especie

1. Localiza la especie en la tabla y haz clic en **Editar**.
2. El modal "Editar Especie" se abrirá con todos los campos precargados, incluyendo la imagen existente (si tiene una).
3. Modifica los campos necesarios. Puedes cambiar la imagen o eliminarla.
4. Presiona **Guardar Cambios**.

#### Eliminar una especie

1. Haz clic en **Eliminar** junto a la especie que deseas borrar.
2. Confirma la eliminación en el diálogo. Recuerda que esta acción no se puede deshacer.

### Cerrar sesión

Para terminar tu sesión de administrador:

1. En el sidebar (barra lateral izquierda), localiza el enlace **Cerrar Sesión** ubicado en la parte inferior, debajo de las opciones de navegación.
2. Haz clic en **Cerrar Sesión**.
3. Serás redirigido a la pantalla de inicio de sesión, donde verás el mensaje de confirmación: "Sesión cerrada correctamente. ¡Hasta pronto!"

Una vez cerrada la sesión, no podrás acceder al Panel Administrativo sin volver a autenticarte.


## 5. Solución de problemas comunes

### Problemas con el mapa 3D

#### Problema: El mapa 3D no carga

**Síntomas:** La pantalla de carga con el mensaje "Cargando Mapa 3D UTTECAM..." permanece indefinidamente o aparece un error en lugar del mapa.

**Solución:**
1. Recarga la página presionando **F5** o el botón de actualizar en tu navegador.
2. Verifica que tu conexión a internet esté funcionando correctamente.
3. Intenta abrir la aplicación en otro navegador actualizado (Chrome, Firefox, Safari o Edge).
4. Si el problema persiste, limpia la caché de tu navegador (Ctrl + Shift + Supr) y vuelve a intentar.

#### Problema: El mapa se ve como pantalla negra o sin texturas

**Síntomas:** El mapa carga pero se muestra completamente negro, sin colores ni formas visibles, o los edificios aparecen sin texturas.

**Solución:**
1. Asegúrate de que tu navegador tenga habilitada la aceleración de hardware (GPU). Busca esta opción en la configuración avanzada de tu navegador.
2. Actualiza los controladores de tu tarjeta gráfica a la versión más reciente.
3. Cierra otras pestañas o aplicaciones que consuman muchos recursos gráficos.
4. Si usas una laptop, conéctala a corriente eléctrica — algunos equipos reducen el rendimiento gráfico en modo batería.

#### Problema: El mapa tiene rendimiento lento o se mueve con retraso

**Síntomas:** Al rotar o hacer zoom en el mapa, la respuesta es lenta o entrecortada. Las animaciones no son fluidas.

**Solución:**
1. Cierra otras pestañas del navegador y aplicaciones que no estés usando para liberar memoria y procesador.
2. Verifica que tu navegador esté actualizado a la última versión disponible.
3. Intenta reducir el tamaño de la ventana del navegador — una ventana más pequeña requiere menos recursos para renderizar el modelo 3D.

### Problemas de inicio de sesión

#### Problema: Credenciales incorrectas al iniciar sesión

**Síntomas:** Al intentar iniciar sesión en el *Panel Administrativo*, aparece el mensaje "Nombre de usuario o contraseña incorrectos." en color rojo.

**Solución:**
1. Verifica que tu nombre de usuario esté escrito correctamente, sin espacios adicionales al inicio o final.
2. Recuerda que la contraseña distingue entre mayúsculas y minúsculas — revisa que no tengas activado el bloqueo de mayúsculas (Caps Lock).
3. Si olvidaste tu contraseña, contacta al administrador del sistema para que te asigne una nueva.

#### Problema: Sesión expirada o acceso denegado

**Síntomas:** Al intentar acceder al panel administrativo o realizar una acción, aparece el mensaje "Acceso denegado. Por favor, inicia sesión." o eres redirigido a la pantalla de login inesperadamente.

**Solución:**
1. Tu sesión ha expirado por inactividad. Inicia sesión nuevamente con tus credenciales.
2. Si el problema ocurre repetidamente en poco tiempo, limpia las cookies del sitio en tu navegador e intenta de nuevo.

### Problemas con GPS

#### Problema: Permiso de ubicación denegado

**Síntomas:** Al hacer clic en **📍 Mi ubicación**, no aparece el marcador GPS y el navegador muestra un aviso de que el permiso de ubicación fue bloqueado.

**Solución:**
1. Haz clic en el ícono de candado o información (ℹ️) en la barra de direcciones de tu navegador.
2. Busca la opción de "Ubicación" o "Localización" y cámbiala a "Permitir".
3. Recarga la página y vuelve a hacer clic en **📍 Mi ubicación**.
4. En dispositivos móviles, verifica también que la ubicación (GPS) esté activada en la configuración general de tu teléfono.

#### Problema: Ubicación imprecisa en el mapa

**Síntomas:** El marcador GPS aparece pero no coincide con tu ubicación real dentro del campus, o se muestra en una posición muy alejada de donde estás.

**Solución:**
1. Asegúrate de estar dentro o cerca del campus de la UTT — el marcador solo es preciso dentro del área mapeada.
2. Si estás en interiores, intenta acercarte a una ventana o salir al exterior para mejorar la señal GPS.
3. Espera unos segundos para que el navegador obtenga una lectura más precisa de tu posición.
4. Verifica que tu dispositivo tenga el GPS de alta precisión activado (en dispositivos móviles, revisa Ajustes > Ubicación > Precisión).

### Problemas en dispositivos móviles

#### Problema: Los gestos táctiles no responden

**Síntomas:** Al tocar o arrastrar sobre el mapa en tu dispositivo móvil, no ocurre ninguna acción — no se puede rotar, hacer zoom ni seleccionar elementos.

**Solución:**
1. Asegúrate de estar tocando directamente sobre el área del mapa y no sobre un botón o menú superpuesto.
2. Intenta recargar la página completamente (desliza hacia abajo en la barra de direcciones o presiona el botón de recarga).
3. Cierra otras aplicaciones en segundo plano para liberar memoria en tu dispositivo.
4. Si usas una funda o protector de pantalla muy grueso, retíralo temporalmente para comprobar si interfiere con la detección táctil.

#### Problema: La pantalla no se ajusta correctamente al dispositivo

**Síntomas:** Parte del contenido se sale de la pantalla, los botones son demasiado pequeños, o la interfaz se ve desproporcionada en tu teléfono o tablet.

**Solución:**
1. Verifica que no tengas activado el zoom del navegador — restablece al 100% si es posible (doble tap con dos dedos en muchos navegadores).
2. Intenta rotar tu dispositivo a orientación horizontal (landscape) para obtener más espacio visual del mapa.
3. Asegúrate de estar usando un navegador actualizado compatible (Chrome, Safari, Firefox o Edge en sus versiones móviles).

## 6. Glosario

- **Código mesh**: Identificador técnico que vincula un registro en la base de datos con su representación visual (su *mesh*) en el modelo 3D del campus.
- **CRUD**: Siglas de Create, Read, Update, Delete (Crear, Leer, Actualizar, Eliminar). Conjunto de operaciones básicas que el Administrador puede realizar sobre los registros del sistema.
- **Ficha_Detalle**: Tarjeta informativa que aparece al hacer clic en un elemento del mapa, mostrando datos detallados como nombre, descripción, carreras o taxonomía según el tipo de elemento.
- **GLB**: Formato de archivo binario para modelos 3D (variante de glTF). MAPAUTT utiliza un archivo GLB para representar el campus tridimensional completo.
- **Marcador GPS**: Indicador visual sobre el mapa 3D que muestra la posición geográfica en tiempo real del usuario dentro del campus.
- **Menú_Explorar**: Panel de categorías dentro del mapa que permite filtrar los elementos visibles según tres grupos: Infraestructura, Áreas comunes y Espacios naturales.
- **Mesh**: En el contexto de gráficos 3D, es la malla de polígonos que define la forma geométrica de un objeto dentro del modelo tridimensional.
- **Panel_Administrativo**: Interfaz de gestión accesible solo para administradores autenticados, desde la cual se realizan operaciones CRUD sobre edificios, áreas verdes y especies.
- **Renderizado**: Proceso mediante el cual el navegador dibuja y muestra el modelo 3D en pantalla, transformando los datos geométricos del archivo GLB en una imagen visual interactiva.
- **Taxonomía**: Sistema jerárquico de clasificación biológica utilizado en MAPAUTT para catalogar las especies del campus (reino, división, clase, orden, familia, género, especie, etc.).
- **Three.js**: Librería de JavaScript utilizada por MAPAUTT para renderizar el modelo 3D del campus directamente en el navegador web.
- **Tooltip**: Pequeña etiqueta flotante que aparece al pasar el cursor (o mantener presionado en móviles) sobre un elemento del mapa, mostrando su nombre como referencia rápida.
