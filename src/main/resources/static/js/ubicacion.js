/**
 * =========================================================
 * SISTEMA DE UBICACIÓN GPS
 * =========================================================
 *
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 * Versión: 2.1
 *
 * Descripción:
 * Sistema de geolocalización que convierte las coordenadas
 * GPS reales del usuario a coordenadas X/Z correspondientes
 * al modelo 3D de la UTTECAM.
 *
 * La configuración y los puntos de calibración se encuentran
 * en el archivo:
 *
 * ubicacion-config.js
 *
 * =========================================================
 */


/* =========================================================
 * VARIABLES GLOBALES DEL SISTEMA GPS
 * ========================================================= */

let marcadorUsuario = null;

let watchIdGPS = null;

let ultimaPosicionGPS = null;

let gpsActivo = false;

let centrarCamaraPendiente = false;

let transformacionGPS = null;


/* =========================================================
 * OBTENER CONFIGURACIÓN GPS
 * ========================================================= */

function obtenerGPSConfig() {

    if (
        !window.GPS_CONFIG
    ) {

        console.error(
            "ERROR: GPS_CONFIG no está disponible."
        );

        console.error(
            "Verifica que ubicacion-config.js se cargue antes de ubicacion.js."
        );

        return null;

    }

    return window.GPS_CONFIG;

}


/* =========================================================
 * OBTENER PUNTOS DE CALIBRACIÓN
 * ========================================================= */

function obtenerPuntosCalibracion() {

    if (
        !window.PUNTOS_CALIBRACION
    ) {

        console.error(
            "ERROR: PUNTOS_CALIBRACION no está disponible."
        );

        console.error(
            "Verifica que ubicacion-config.js se cargue antes de ubicacion.js."
        );

        return [];

    }

    return window.PUNTOS_CALIBRACION;

}


/* =========================================================
 * CONVERSIÓN GPS A METROS
 * ========================================================= */

function gpsAMetros(
    latitud,
    longitud
) {

    const puntos =
        obtenerPuntosCalibracion();

    if (
        puntos.length === 0
    ) {

        return {
            este: 0,
            norte: 0
        };

    }

    const referencia =
        puntos[0];

    const metrosLatitud =
        111320;

    const metrosLongitud =
        111320 *
        Math.cos(
            referencia.latitud *
            Math.PI /
            180
        );

    const este =
        (
            longitud -
            referencia.longitud
        ) *
        metrosLongitud;

    const norte =
        (
            latitud -
            referencia.latitud
        ) *
        metrosLatitud;

    return {

        este: este,

        norte: norte

    };

}


/* =========================================================
 * DISTANCIA GPS
 * ========================================================= */

function distanciaGPS(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R =
        6371000;

    const lat1Rad =
        lat1 *
        Math.PI /
        180;

    const lat2Rad =
        lat2 *
        Math.PI /
        180;

    const deltaLat =
        (
            lat2 -
            lat1
        ) *
        Math.PI /
        180;

    const deltaLon =
        (
            lon2 -
            lon1
        ) *
        Math.PI /
        180;

    const a =
        Math.sin(
            deltaLat / 2
        ) ** 2 +

        Math.cos(
            lat1Rad
        ) *

        Math.cos(
            lat2Rad
        ) *

        Math.sin(
            deltaLon / 2
        ) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;

}


/* =========================================================
 * OBTENER PUNTO GPS MÁS CERCANO
 * ========================================================= */

function obtenerPuntoMasCercano(
    latitud,
    longitud
) {

    const puntos =
        obtenerPuntosCalibracion();

    let puntoCercano =
        null;

    let distanciaMenor =
        Infinity;

    for (
        const punto of puntos
    ) {

        const distancia =
            distanciaGPS(
                latitud,
                longitud,
                punto.latitud,
                punto.longitud
            );

        if (
            distancia <
            distanciaMenor
        ) {

            distanciaMenor =
                distancia;

            puntoCercano =
                punto;

        }

    }

    return {

        punto:
            puntoCercano,

        distancia:
            distanciaMenor

    };

}


/* =========================================================
 * RESOLVER SISTEMA 3X3
 * ========================================================= */

function resolverSistema3x3(
    A,
    B
) {

    const matriz = [

        [
            A[0][0],
            A[0][1],
            A[0][2],
            B[0]
        ],

        [
            A[1][0],
            A[1][1],
            A[1][2],
            B[1]
        ],

        [
            A[2][0],
            A[2][1],
            A[2][2],
            B[2]
        ]

    ];

    for (
        let columna = 0;
        columna < 3;
        columna++
    ) {

        let filaPivote =
            columna;

        for (
            let fila = columna + 1;
            fila < 3;
            fila++
        ) {

            if (
                Math.abs(
                    matriz[fila][columna]
                ) >
                Math.abs(
                    matriz[filaPivote][columna]
                )
            ) {

                filaPivote =
                    fila;

            }

        }

        if (
            Math.abs(
                matriz[filaPivote][columna]
            ) <
            0.000000001
        ) {

            throw new Error(
                "Sistema de calibración degenerado."
            );

        }

        const temporal =
            matriz[columna];

        matriz[columna] =
            matriz[filaPivote];

        matriz[filaPivote] =
            temporal;

        const pivote =
            matriz[columna][columna];

        for (
            let j = columna;
            j < 4;
            j++
        ) {

            matriz[columna][j] /=
                pivote;

        }

        for (
            let fila = 0;
            fila < 3;
            fila++
        ) {

            if (
                fila === columna
            ) {

                continue;

            }

            const factor =
                matriz[fila][columna];

            for (
                let j = columna;
                j < 4;
                j++
            ) {

                matriz[fila][j] -=
                    factor *
                    matriz[columna][j];

            }

        }

    }

    return [

        matriz[0][3],

        matriz[1][3],

        matriz[2][3]

    ];

}


/* =========================================================
 * CALCULAR TRANSFORMACIÓN GPS
 * ========================================================= */

function calcularTransformacionGPS() {

    const puntos =
        obtenerPuntosCalibracion();

    if (
        puntos.length < 3
    ) {

        console.error(
            "No hay suficientes puntos de calibración."
        );

        return;

    }

    console.log(
        "Calculando transformación GPS..."
    );

    let sEE = 0;
    let sEN = 0;
    let sNN = 0;

    let sE = 0;
    let sN = 0;

    let sEX = 0;
    let sNX = 0;
    let sX = 0;

    let sEZ = 0;
    let sNZ = 0;
    let sZ = 0;

    const n =
        puntos.length;

    for (
        const punto of puntos
    ) {

        const local =
            gpsAMetros(
                punto.latitud,
                punto.longitud
            );

        sEE +=
            local.este *
            local.este;

        sEN +=
            local.este *
            local.norte;

        sNN +=
            local.norte *
            local.norte;

        sE +=
            local.este;

        sN +=
            local.norte;

        sEX +=
            local.este *
            punto.x;

        sNX +=
            local.norte *
            punto.x;

        sX +=
            punto.x;

        sEZ +=
            local.este *
            punto.z;

        sNZ +=
            local.norte *
            punto.z;

        sZ +=
            punto.z;

    }

    const matriz = [

        [
            sEE,
            sEN,
            sE
        ],

        [
            sEN,
            sNN,
            sN
        ],

        [
            sE,
            sN,
            n
        ]

    ];

    const coefX =
        resolverSistema3x3(
            matriz,
            [
                sEX,
                sNX,
                sX
            ]
        );

    const coefZ =
        resolverSistema3x3(
            matriz,
            [
                sEZ,
                sNZ,
                sZ
            ]
        );

    transformacionGPS = {

        a:
            coefX[0],

        b:
            coefX[1],

        c:
            coefX[2],

        d:
            coefZ[0],

        e:
            coefZ[1],

        f:
            coefZ[2]

    };

    console.log(
        "Transformación GPS calculada:",
        transformacionGPS
    );

    evaluarCalibracion();

}


/* =========================================================
 * EVALUAR CALIBRACIÓN
 * ========================================================= */

function evaluarCalibracion() {

    if (
        !transformacionGPS
    ) {

        return;

    }

    const puntos =
        obtenerPuntosCalibracion();

    let errorTotal =
        0;

    for (
        const punto of puntos
    ) {

        const local =
            gpsAMetros(
                punto.latitud,
                punto.longitud
            );

        const x =
            transformacionGPS.a *
            local.este +

            transformacionGPS.b *
            local.norte +

            transformacionGPS.c;

        const z =
            transformacionGPS.d *
            local.este +

            transformacionGPS.e *
            local.norte +

            transformacionGPS.f;

        const errorX =
            x -
            punto.x;

        const errorZ =
            z -
            punto.z;

        const error =
            Math.sqrt(
                errorX * errorX +
                errorZ * errorZ
            );

        errorTotal +=
            error;

        console.log(
            punto.nombre,
            "| Error:",
            error.toFixed(3),
            "unidades"
        );

    }

    const errorPromedio =
        errorTotal /
        puntos.length;

    console.log(
        "Error promedio:",
        errorPromedio.toFixed(3),
        "unidades del modelo"
    );

}


/* =========================================================
 * CONVERTIR GPS A MODELO 3D
 * ========================================================= */

function convertirGPSa3D(
    latitud,
    longitud
) {

    if (
        typeof THREE === "undefined"
    ) {

        console.error(
            "Three.js no está disponible."
        );

        return null;

    }

    if (
        !transformacionGPS
    ) {

        calcularTransformacionGPS();

    }

    if (
        !transformacionGPS
    ) {

        return null;

    }

    const config =
        obtenerGPSConfig();

    if (
        !config
    ) {

        return null;

    }

    const cercano =
        obtenerPuntoMasCercano(
            latitud,
            longitud
        );

    if (
        cercano.punto &&
        cercano.distancia <=
        config.radioCoincidencia
    ) {

        console.log(
            "Punto conocido:",
            cercano.punto.nombre,
            "| Distancia:",
            cercano.distancia.toFixed(2),
            "m"
        );

        return new THREE.Vector3(

            cercano.punto.x,

            config.alturaMarcador,

            cercano.punto.z

        );

    }

    const local =
        gpsAMetros(
            latitud,
            longitud
        );

    const x =
        transformacionGPS.a *
        local.este +

        transformacionGPS.b *
        local.norte +

        transformacionGPS.c;

    const z =
        transformacionGPS.d *
        local.este +

        transformacionGPS.e *
        local.norte +

        transformacionGPS.f;

    console.log(
        "GPS -> MODELO",
        "X:",
        x,
        "Z:",
        z
    );

    return new THREE.Vector3(

        x,

        config.alturaMarcador,

        z

    );

}


/* =========================================================
 * CREAR MARCADOR DEL USUARIO
 * ========================================================= */

function crearMarcadorUsuario() {

    if (
        typeof THREE === "undefined"
    ) {

        console.error(
            "Three.js no está disponible."
        );

        return null;

    }

    if (
        typeof scene === "undefined" ||
        !scene
    ) {

        console.error(
            "La escena de Three.js no está disponible."
        );

        return null;

    }

    if (
        marcadorUsuario
    ) {

        return marcadorUsuario;

    }

    const config =
        obtenerGPSConfig();

    if (
        !config
    ) {

        return null;

    }

    marcadorUsuario =
        new THREE.Group();

    marcadorUsuario.name =
        "MarcadorUsuario";

    const geometria =
        new THREE.SphereGeometry(

            config.tamanoMarcador *
            0.35,

            24,

            24

        );

    const material =
        new THREE.MeshBasicMaterial({

            color:
                config.colorMarcador,

            depthTest:
                false,

            depthWrite:
                false

        });

    const esfera =
        new THREE.Mesh(
            geometria,
            material
        );

    esfera.position.y =
        2;

    esfera.renderOrder =
        1000;

    marcadorUsuario.add(
        esfera
    );

    const geometriaAro =
        new THREE.RingGeometry(

            config.tamanoMarcador *
            0.55,

            config.tamanoMarcador *
            0.75,

            32

        );

    const materialAro =
        new THREE.MeshBasicMaterial({

            color:
                config.colorMarcador,

            side:
                THREE.DoubleSide,

            transparent:
                true,

            opacity:
                0.35,

            depthTest:
                false,

            depthWrite:
                false

        });

    const aro =
        new THREE.Mesh(
            geometriaAro,
            materialAro
        );

    aro.rotation.x =
        -Math.PI / 2;

    aro.position.y =
        0.05;

    aro.renderOrder =
        999;

    marcadorUsuario.add(
        aro
    );

    scene.add(
        marcadorUsuario
    );

    marcadorUsuario.visible =
        false;

    console.log(
        "Marcador GPS creado."
    );

    return marcadorUsuario;

}

/* =========================================================
 * GLOBO DE PRECISION GPS
 * ========================================================= */

/**
 * Crea el aviso visual que informa al usuario
 * sobre el margen de error de la ubicación GPS.
 *
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 * Version: 1.2
 */
function crearAvisoPrecisionGPS() {

    let aviso = document.getElementById(
        "gps-precision-aviso"
    );

    if (aviso) {
        return aviso;
    }

    aviso = document.createElement("div");

    aviso.id = "gps-precision-aviso";

    aviso.innerHTML = `
        <div class="gps-aviso-icono">📍</div>

        <div class="gps-aviso-contenido">

            <strong>
                Ubicación aproximada
            </strong>

            <span>
                Puede existir un margen de error
                de aproximadamente <b>20 a 35 metros</b>.
            </span>

        </div>

        <button
            type="button"
            class="gps-aviso-cerrar"
            aria-label="Cerrar aviso">
            ×
        </button>
    `;

    document.body.appendChild(aviso);

    const botonCerrar =
        aviso.querySelector(
            ".gps-aviso-cerrar"
        );

    botonCerrar.addEventListener(
        "click",
        function () {

            aviso.classList.remove(
                "gps-aviso-visible"
            );

        }
    );

    return aviso;
}


/**
 * Muestra el aviso de precisión GPS.
 */
function mostrarAvisoPrecisionGPS() {

    const aviso =
        crearAvisoPrecisionGPS();

    aviso.classList.add(
        "gps-aviso-visible"
    );
}


/**
 * Oculta el aviso de precisión GPS.
 */
function ocultarAvisoPrecisionGPS() {

    const aviso =
        document.getElementById(
            "gps-precision-aviso"
        );

    if (!aviso) {
        return;
    }

    aviso.classList.remove(
        "gps-aviso-visible"
    );
}

/* =========================================================
 * ACTUALIZAR MARCADOR
 * ========================================================= */

function actualizarMarcadorUsuario(
    posicion
) {

    if (
        !posicion
    ) {

        console.error(
            "No se recibió una posición 3D válida."
        );

        return;

    }

    if (
        !marcadorUsuario
    ) {

        crearMarcadorUsuario();

    }

    if (
        !marcadorUsuario
    ) {

        return;

    }

    marcadorUsuario.position.set(

        posicion.x,

        posicion.y,

        posicion.z

    );

    marcadorUsuario.visible =
        true;

    console.log(

        "Marcador GPS:",

        "X =",
        posicion.x.toFixed(3),

        "Y =",
        posicion.y.toFixed(3),

        "Z =",
        posicion.z.toFixed(3)

    );

}


/* =========================================================
 * CENTRAR CÁMARA
 * ========================================================= */

function centrarCamaraEnUsuario(
    posicion3D
) {

    if (
        !posicion3D
    ) {

        console.error(
            "Posición 3D inválida."
        );

        return;

    }

    if (
        typeof camera === "undefined" ||
        !camera
    ) {

        console.error(
            "La cámara no está disponible."
        );

        return;

    }

    if (
        typeof controls === "undefined" ||
        !controls
    ) {

        console.error(
            "Los controles del mapa no están disponibles."
        );

        return;

    }

    controls.target.copy(
        posicion3D
    );

    camera.lookAt(
        posicion3D
    );

    controls.update();

    console.log(
        "Cámara centrada en usuario."
    );

}


/* =========================================================
 * ACTUALIZAR UBICACIÓN
 * ========================================================= */

function actualizarUbicacion(
    position
) {

    if (
        !position ||
        !position.coords
    ) {

        console.error(
            "Posición GPS inválida."
        );

        return;

    }

    const config =
        obtenerGPSConfig();

    if (
        !config
    ) {

        return;

    }

    const coords =
        position.coords;

    const latitud =
        coords.latitude;

    const longitud =
        coords.longitude;

    const precision =
        coords.accuracy;

    console.log(
        "========================================"
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

    /*
     * Rechazar posiciones demasiado imprecisas.
     */

    if (
        precision &&
        precision >
        config.precisionMaxima
    ) {

        console.warn(
            "Lectura GPS descartada por baja precisión:",
            precision,
            "metros."
        );

        return;

    }

    /*
     * La ubicación ya es válida.
     */

    gpsActivo =
        true;

    ultimaPosicionGPS =
        position;

    /*
     * Activar estado visual del botón.
     */

    const boton =
        document.getElementById(
            "btn-ubicacion"
        );

    if (
        boton
    ) {

        boton.classList.add(
            "active"
        );

    }

    /*
     * Convertir coordenadas.
     */

    const posicion3D =
        convertirGPSa3D(
            latitud,
            longitud
        );

    if (
        !posicion3D
    ) {

        console.error(
            "No fue posible convertir la ubicación GPS al modelo."
        );

        return;

    }

    /*
     * Actualizar marcador.
     */

    actualizarMarcadorUsuario(
        posicion3D
    );

    /*
     * Actualizar burbuja de advertencia.
     */

    mostrarAvisoPrecisionGPS();

    /*
     * Guardar ubicación global.
     */

    window.ultimaUbicacionUsuario = {

        latitud:
            latitud,

        longitud:
            longitud,

        precision:
            precision,

        posicion3D:
            posicion3D

    };

    /*
     * Centrar cámara después de
     * obtener la primera ubicación.
     */

    if (
        centrarCamaraPendiente
    ) {

        centrarCamaraEnUsuario(
            posicion3D
        );

        centrarCamaraPendiente =
            false;

    }

}


/* =========================================================
 * ERROR GPS
 * ========================================================= */

function errorGPS(
    error
) {

    console.error(
        "========================================"
    );

    console.error(
        "ERROR GPS"
    );

    console.error(
        "Código:",
        error.code
    );

    console.error(
        "Mensaje:",
        error.message
    );

    /*
     * Si se perdió el permiso,
     * detener el estado activo.
     */

    if (
        error.code === 1
    ) {

        gpsActivo =
            false;

        const boton =
            document.getElementById(
                "btn-ubicacion"
            );

        if (
            boton
        ) {

            boton.classList.remove(
                "active"
            );

        }

        alert(
            "No se permitió acceder a tu ubicación.\n\n" +
            "Revisa los permisos de ubicación del navegador.\n\n" +
            "Si estás accediendo mediante una dirección HTTP, " +
            "utiliza HTTPS o localhost."
        );

        return;

    }

    /*
     * Ubicación no disponible.
     */

    if (
        error.code === 2
    ) {

        console.error(
            "La ubicación no está disponible."
        );

        alert(
            "No se pudo obtener tu ubicación.\n\n" +
            "Comprueba que la ubicación/GPS esté activada."
        );

        return;

    }

    /*
     * Tiempo agotado.
     */

    if (
        error.code === 3
    ) {

        console.error(
            "Tiempo de espera agotado."
        );

        alert(
            "El GPS tardó demasiado en responder.\n\n" +
            "Intenta nuevamente."
        );

        return;

    }

    /*
     * Error desconocido.
     */

    alert(
        "Ocurrió un error al obtener tu ubicación."
    );

}


/* =========================================================
 * INICIAR GPS
 * ========================================================= */

function iniciarGPS() {

    console.log(
        "========================================"
    );

    console.log(
        "INICIANDO GPS..."
    );

    console.log(
        "URL:",
        window.location.href
    );

    console.log(
        "Protocolo:",
        window.location.protocol
    );

    console.log(
        "Contexto seguro:",
        window.isSecureContext
    );

    /*
     * Comprobar soporte del navegador.
     */

    if (
        !navigator.geolocation
    ) {

        console.error(
            "El navegador no soporta geolocalización."
        );

        alert(
            "Tu navegador no soporta geolocalización."
        );

        return false;

    }

    /*
     * Mostrar advertencia si el sitio
     * no utiliza un contexto seguro.
     */

    if (
        !window.isSecureContext
    ) {

        console.warn(
            "ADVERTENCIA: el sitio no está en un contexto seguro."
        );

        console.warn(
            "La geolocalización puede ser bloqueada."
        );

    }

    /*
     * Crear marcador.
     */

    crearMarcadorUsuario();

    /*
     * Evitar múltiples seguimientos.
     */

    if (
        watchIdGPS !== null
    ) {

        navigator.geolocation.clearWatch(
            watchIdGPS
        );

        watchIdGPS =
            null;

    }

    /*
     * Solicitar ubicación.
     */

    console.log(
        "Solicitando permiso de ubicación..."
    );

    watchIdGPS =
        navigator.geolocation.watchPosition(

            function (position) {

                console.log(
                    "Posición GPS recibida."
                );

                actualizarUbicacion(
                    position
                );

            },

            function (error) {

                errorGPS(
                    error
                );

            },

            {

                enableHighAccuracy:
                    true,

                timeout:
                    30000,

                maximumAge:
                    1000

            }

        );

    console.log(
        "watchPosition iniciado."
    );

    console.log(
        "ID del seguimiento:",
        watchIdGPS
    );

    /*
     * No se establece gpsActivo = true
     * todavía.
     *
     * Se hará únicamente cuando
     * llegue una posición válida.
     */

    return true;

}


/* =========================================================
 * DETENER GPS
 * ========================================================= */

function detenerGPS() {

    if (
        watchIdGPS !== null
    ) {

        navigator.geolocation.clearWatch(
            watchIdGPS
        );

        watchIdGPS =
            null;

    }

    gpsActivo =
        false;

    centrarCamaraPendiente =
        false;

    const boton =
        document.getElementById(
            "btn-ubicacion"
        );

    if (
        boton
    ) {

        boton.classList.remove(
            "active"
        );

    }

    console.log(
        "GPS DETENIDO."
    );

}


/* =========================================================
 * CONECTAR BOTÓN DE UBICACIÓN
 * ========================================================= */

/* =========================================================
 * CONECTAR BOTÓN DE UBICACIÓN
 * ========================================================= */

function conectarBotonUbicacion() {

    const botonUbicacion =
        document.getElementById(
            "btn-ubicacion"
        );

    if (
        !botonUbicacion
    ) {

        console.error(
            "ERROR: no existe el botón #btn-ubicacion."
        );

        return false;
    }

    /*
     * Evitar conectar el mismo botón
     * más de una vez.
     */

    if (
        botonUbicacion.dataset.gpsConectado ===
        "true"
    ) {

        console.log(
            "El botón GPS ya estaba conectado."
        );

        return true;
    }

    botonUbicacion.dataset.gpsConectado =
        "true";

    console.log(
        "BOTÓN GPS CONECTADO CORRECTAMENTE"
    );

    /*
     * Evento click.
     */

    botonUbicacion.addEventListener(

        "click",

        function (evento) {

            evento.preventDefault();
            evento.stopPropagation();

            console.log(
                "BOTÓN DE UBICACIÓN PRESIONADO"
            );

            /*
             * =============================================
             * SI EL GPS ESTÁ ACTIVO
             * =============================================
             *
             * Al presionar nuevamente:
             * - Detener seguimiento GPS.
             * - Ocultar marcador.
             * - Ocultar aviso de precisión.
             * - Quitar estado visual del botón.
             */

            if (
                gpsActivo ||
                watchIdGPS !== null
            ) {

                console.log(
                    "Desactivando GPS..."
                );

                detenerGPS();

                /*
                 * Ocultar marcador del usuario.
                 */

                if (
                    marcadorUsuario
                ) {

                    marcadorUsuario.visible =
                        false;
                }

                /*
                 * Ocultar aviso de precisión.
                 */

                ocultarAvisoPrecisionGPS();

                console.log(
                    "GPS DESACTIVADO."
                );

                return;
            }

            /*
             * =============================================
             * SI EL GPS ESTÁ APAGADO
             * =============================================
             *
             * Iniciar nuevamente el seguimiento.
             */

            console.log(
                "Activando GPS..."
            );

            centrarCamaraPendiente =
                true;

            iniciarGPS();

        },

        false

    );

    return true;

}


/* =========================================================
 * PRUEBA MANUAL
 * ========================================================= */

function probarUbicacion(
    latitud,
    longitud
) {

    console.log(
        "PRUEBA MANUAL GPS"
    );

    const posicion =
        convertirGPSa3D(
            latitud,
            longitud
        );

    if (
        !posicion
    ) {

        return;

    }

    actualizarMarcadorUsuario(
        posicion
    );

    centrarCamaraEnUsuario(
        posicion
    );

}


/* =========================================================
 * PRUEBA PUNTO DE CALIBRACIÓN
 * ========================================================= */

function probarPuntoCalibracion(
    indice
) {

    const puntos =
        obtenerPuntosCalibracion();

    if (
        indice < 0 ||
        indice >=
        puntos.length
    ) {

        console.error(
            "Índice de calibración inválido."
        );

        return;

    }

    const punto =
        puntos[indice];

    console.log(
        "Probando:",
        punto.nombre
    );

    probarUbicacion(

        punto.latitud,

        punto.longitud

    );

}


/* =========================================================
 * INICIALIZACIÓN
 * ========================================================= */

function inicializarGPS() {

    console.log(
        "========================================"
    );

    console.log(
        "INICIALIZANDO MÓDULO GPS"
    );

    console.log(
        "========================================"
    );

    /*
     * Verificar que el archivo de configuración
     * haya sido cargado correctamente.
     */

    if (
        !window.GPS_CONFIG
    ) {

        console.error(
            "GPS_CONFIG no está disponible."
        );

        return;

    }

    if (
        !window.PUNTOS_CALIBRACION
    ) {

        console.error(
            "PUNTOS_CALIBRACION no está disponible."
        );

        return;

    }

    /*
     * Calcular transformación si Three.js
     * ya está disponible.
     */

    if (
        typeof THREE !== "undefined"
    ) {

        try {

            calcularTransformacionGPS();

        } catch (error) {

            console.error(
                "Error al calcular la transformación GPS:",
                error
            );

        }

    } else {

        console.warn(
            "Three.js todavía no está disponible."
        );

        console.warn(
            "La transformación se calculará al iniciar el GPS."
        );

    }

    /*
     * Conectar botón.
     */

    conectarBotonUbicacion();

    console.log(
        window.PUNTOS_CALIBRACION.length,
        "puntos de calibración disponibles."
    );

}


/* =========================================================
 * EXPORTAR FUNCIONES
 * ========================================================= */

window.iniciarGPS =
    iniciarGPS;

window.detenerGPS =
    detenerGPS;

window.actualizarUbicacion =
    actualizarUbicacion;

window.convertirGPSa3D =
    convertirGPSa3D;

window.crearMarcadorUsuario =
    crearMarcadorUsuario;

window.actualizarMarcadorUsuario =
    actualizarMarcadorUsuario;

window.centrarCamaraEnUsuario =
    centrarCamaraEnUsuario;

window.probarUbicacion =
    probarUbicacion;

window.probarPuntoCalibracion =
    probarPuntoCalibracion;

window.conectarBotonUbicacion =
    conectarBotonUbicacion;

window.calcularTransformacionGPS =
    calcularTransformacionGPS;


/* =========================================================
 * INICIAR CUANDO EL DOCUMENTO ESTÉ LISTO
 * ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(

        "DOMContentLoaded",

        inicializarGPS

    );

} else {

    inicializarGPS();

}


/* =========================================================
 * MENSAJE FINAL
 * ========================================================= */

console.log(
    "========================================"
);

console.log(
    "MÓDULO GPS CARGADO CORRECTAMENTE"
);

console.log(
    "========================================"
);






