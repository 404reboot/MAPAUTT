/**
 * =========================================================
 * SISTEMA DE UBICACIÓN DEL USUARIO
 * =========================================================
 *
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 *
 * Obtiene la ubicación GPS del dispositivo y la convierte
 * a coordenadas del modelo 3D de Three.js.
 */

/* =========================================================
 * VARIABLES DEL SISTEMA
 * ========================================================= */

/**
 * Identificador utilizado para detener el seguimiento GPS.
 */
let watchID = null;

/**
 * Marcador que representa al usuario.
 */
let userLocationMarker = null;

/**
 * Indica si el sistema GPS está activo.
 */
let gpsActivo = false;


/* =========================================================
 * INICIALIZACIÓN
 * ========================================================= */

/**
 * Inicializa el sistema de ubicación.
 */
function inicializarUbicacion() {

    const botonUbicacion =
        document.getElementById("btn-user-location");

    if (!botonUbicacion) {

        console.warn(
            "No se encontró el botón de ubicación."
        );

        return;
    }

    botonUbicacion.addEventListener(
        "click",
        activarUbicacion
    );

    console.log(
        "Sistema de ubicación inicializado correctamente."
    );
}


/* =========================================================
 * ACTIVAR GPS
 * ========================================================= */

/**
 * Activa el seguimiento GPS.
 */
function activarUbicacion() {

    console.log(
        "Activando sistema de ubicación..."
    );

    /*
     * Si el GPS ya está activo,
     * se detiene.
     */
    if (gpsActivo) {

        detenerUbicacion();

        return;
    }

    /*
     * Comprobar compatibilidad.
     */
    if (!navigator.geolocation) {

        mostrarErrorUbicacion(
            "Tu navegador no permite obtener la ubicación."
        );

        return;
    }

    /*
     * Activar estado visual.
     */
    gpsActivo = true;

    const boton =
        document.getElementById(
            "btn-user-location"
        );

    if (boton) {

        boton.classList.add("active");
    }


    /*
     * =====================================================
     * CREAR MARCADOR INMEDIATAMENTE
     * =====================================================
     *
     * Esto permite comprobar que el marcador funciona
     * incluso antes de recibir la posición GPS.
     */

    if (
        typeof scene !== "undefined"
    ) {

        if (!userLocationMarker) {

            crearMarcadorUsuario();
        }

        /*
         * Posición inicial de prueba.
         */
        if (
            UBICACION_CONFIG.modoPrueba
        ) {

            const posicionInicial =
                new THREE.Vector3(
                    UBICACION_CONFIG.posicionPrueba.x,
                    UBICACION_CONFIG.posicionPrueba.y,
                    UBICACION_CONFIG.posicionPrueba.z
                );

            actualizarMarcadorUsuario(
                posicionInicial
            );

            console.log(
                "Marcador de prueba colocado en el centro."
            );
        }

    } else {

        console.warn(
            "La escena Three.js todavía no está disponible."
        );
    }


    /*
     * =====================================================
     * INICIAR GPS
     * =====================================================
     */

    watchID =
        navigator.geolocation.watchPosition(

            actualizarUbicacion,

            errorUbicacion,

            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 15000
            }
        );

    console.log(
        "Seguimiento GPS iniciado."
    );
}


/* =========================================================
 * ACTUALIZAR UBICACIÓN
 * ========================================================= */
function actualizarUbicacion(position) {

    const latitud =
        position.coords.latitude;

    const longitud =
        position.coords.longitude;

    const precision =
        position.coords.accuracy;


    console.log(
        "===================================="
    );

    console.log(
        "GPS RECIBIDO"
    );

    console.log(
        "Latitud:",
        latitud
    );

    console.log(
        "Longitud:",
        longitud
    );

    console.log(
        "Precisión:",
        precision,
        "metros"
    );


    /**
     * Convertir GPS a coordenadas 3D.
     */
    const posicion3D =
        convertirGPSa3D(
            latitud,
            longitud
        );


    console.log(
        "POSICIÓN CALCULADA EN THREE.JS:"
    );

    console.log(
        "X:",
        posicion3D.x
    );

    console.log(
        "Y:",
        posicion3D.y
    );

    console.log(
        "Z:",
        posicion3D.z
    );


    /**
     * Actualizar marcador.
     */
    actualizarMarcadorUsuario(
        posicion3D
    );


    /**
     * Guardar última ubicación.
     */
    window.ultimaUbicacionUsuario = {

        latitud: latitud,

        longitud: longitud,

        precision: precision,

        posicion3D: posicion3D

    };
}

/**
 * =========================================================
 * CONVERSIÓN GPS → THREE.JS
 * =========================================================
 *
 * Convierte una coordenada GPS real a una posición
 * dentro del modelo 3D.
 *
 * @param {number} latitud
 * @param {number} longitud
 * @returns {THREE.Vector3}
 */
function convertirGPSa3D(latitud, longitud) {

    const config = UBICACION_CONFIG;


    /**
     * =====================================================
     * CONVERSIÓN DE GRADOS A METROS
     * =====================================================
     *
     * Aproximación para la zona de Tecamachalco.
     */

    const metrosPorGradoLatitud = 111320;

    const metrosPorGradoLongitud =
        111320 *
        Math.cos(
            THREE.MathUtils.degToRad(
                config.origenGPS.latitud
            )
        );


    /**
     * =====================================================
     * DISTANCIA GPS RESPECTO AL ORIGEN
     * =====================================================
     */

    const metrosNorte =
        (latitud -
            config.origenGPS.latitud) *
        metrosPorGradoLatitud;


    const metrosEste =
        (longitud -
            config.origenGPS.longitud) *
        metrosPorGradoLongitud;


    /**
     * =====================================================
     * CONVERSIÓN AL EJE X
     * =====================================================
     */

    const x =
        config.origen3D.x +

        (
            metrosEste *
            config.conversionX.metrosEste
        ) +

        (
            metrosNorte *
            config.conversionX.metrosNorte
        );


    /**
     * =====================================================
     * CONVERSIÓN AL EJE Z
     * =====================================================
     */

    const z =
        config.origen3D.z +

        (
            metrosEste *
            config.conversionZ.metrosEste
        ) +

        (
            metrosNorte *
            config.conversionZ.metrosNorte
        );


    /**
     * =====================================================
     * CREAR POSICIÓN THREE.JS
     * =====================================================
     *
     * X = posición horizontal
     * Y = altura sobre el terreno
     * Z = profundidad horizontal
     */

    return new THREE.Vector3(

        x,

        config.alturaMarcador,

        z

    );
}


/* =========================================================
 * CREAR MARCADOR
 * ========================================================= */

/**
 * Crea el marcador visual del usuario.
 */
function crearMarcadorUsuario() {

    console.log(
        "Creando marcador del usuario..."
    );


    /*
     * Geometría circular.
     */
    const geometry =
        new THREE.CircleGeometry(
            UBICACION_CONFIG.tamañoMarcador,
            32
        );


    /*
     * Material azul.
     */
    const material =
        new THREE.MeshBasicMaterial({

            color: 0x2196f3,

            transparent: true,

            opacity: 0.95,

            side: THREE.DoubleSide,

            depthTest: false,

            depthWrite: false
        });


    /*
     * Crear Mesh.
     */
    userLocationMarker =
        new THREE.Mesh(
            geometry,
            material
        );


    /*
     * Colocar horizontalmente.
     */
    userLocationMarker.rotation.x =
        -Math.PI / 2;


    /*
     * Posición inicial.
     */
    userLocationMarker.position.set(
        0,
        UBICACION_CONFIG.alturaMarcador,
        0
    );


    /*
     * Evitar que quede oculto
     * detrás de otros elementos.
     */
    userLocationMarker.renderOrder =
        999;


    /*
     * Agregar a la escena.
     */
    scene.add(
        userLocationMarker
    );


    console.log(
        "Marcador creado correctamente."
    );
}


/* =========================================================
 * ACTUALIZAR MARCADOR
 * ========================================================= */

/**
 * Actualiza la posición del marcador.
 *
 * @param {THREE.Vector3} posicion
 */
function actualizarMarcadorUsuario(
    posicion
) {

    /*
     * Comprobar escena.
     */
    if (
        typeof scene === "undefined"
    ) {

        console.warn(
            "La escena Three.js no está disponible."
        );

        return;
    }


    /*
     * Crear marcador si todavía no existe.
     */
    if (!userLocationMarker) {

        crearMarcadorUsuario();
    }


    /*
     * Actualizar posición.
     */
    userLocationMarker.position.copy(
        posicion
    );


    /*
     * Forzar altura.
     */
    userLocationMarker.position.y =
        UBICACION_CONFIG.alturaMarcador;


    console.log(
        "Marcador actualizado:",
        userLocationMarker.position
    );
}


/* =========================================================
 * DETENER GPS
 * ========================================================= */

/**
 * Detiene el seguimiento GPS.
 */
function detenerUbicacion() {

    if (
        watchID !== null
    ) {

        navigator.geolocation.clearWatch(
            watchID
        );

        watchID = null;
    }


    gpsActivo = false;


    const boton =
        document.getElementById(
            "btn-user-location"
        );

    if (boton) {

        boton.classList.remove(
            "active"
        );
    }


    console.log(
        "Seguimiento GPS detenido."
    );
}


/* =========================================================
 * MANEJO DE ERRORES
 * ========================================================= */

/**
 * Maneja errores del sistema GPS.
 *
 * @param {GeolocationPositionError} error
 */
function errorUbicacion(
    error
) {

    console.error(
        "Error GPS:",
        error
    );


    switch (error.code) {

        case error.PERMISSION_DENIED:

            mostrarErrorUbicacion(
                "No se permitió acceder a tu ubicación."
            );

            break;


        case error.POSITION_UNAVAILABLE:

            mostrarErrorUbicacion(
                "No fue posible obtener tu ubicación."
            );

            break;


        case error.TIMEOUT:

            mostrarErrorUbicacion(
                "La ubicación tardó demasiado en responder."
            );

            break;


        default:

            mostrarErrorUbicacion(
                "Ocurrió un error al obtener tu ubicación."
            );
    }
}


/* =========================================================
 * MOSTRAR ERROR
 * ========================================================= */

/**
 * Muestra un mensaje de error.
 *
 * @param {string} mensaje
 */
function mostrarErrorUbicacion(
    mensaje
) {

    console.warn(
        mensaje
    );

    alert(
        mensaje
    );
}


/* =========================================================
 * INICIAR SISTEMA
 * ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    inicializarUbicacion
);