/**
 * =========================================================
 * SISTEMA DE UBICACION GPS
 * =========================================================
 *
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 *
 * Descripcion:
 * Convierte coordenadas GPS reales a coordenadas X/Z
 * correspondientes al modelo 3D de la UTTECAM.
 *
 * El sistema utiliza multiples puntos de calibracion
 * para obtener una transformacion geografica ajustada
 * al modelo 3D.
 */


/* =========================================================
 * VARIABLES GLOBALES
 * ========================================================= */

/**
 * Marcador 3D del usuario.
 *
 * @type {THREE.Group|null}
 */
let marcadorUsuario = null;


/**
 * Identificador del seguimiento GPS.
 *
 * @type {number|null}
 */
let watchIdGPS = null;


/**
 * Ultima posicion GPS recibida.
 *
 * @type {GeolocationPosition|null}
 */
let ultimaPosicionGPS = null;


/**
 * Indica si el GPS esta activo.
 *
 * @type {boolean}
 */
let gpsActivo = false;


/**
 * Indica si la camara debe centrarse
 * cuando llegue una posicion GPS.
 *
 * @type {boolean}
 */
let centrarCamaraPendiente = false;


/**
 * Coeficientes de la transformacion GPS -> modelo.
 *
 * X = a * Este + b * Norte + c
 *
 * Z = d * Este + e * Norte + f
 *
 * @type {Object|null}
 */
let transformacionGPS = null;


/* =========================================================
 * CONFIGURACION
 * ========================================================= */

const GPS_CONFIG = {

    /**
     * Altura del marcador.
     */
    alturaMarcador: 3,

    /**
     * Tamaño del marcador.
     */
    tamanoMarcador: 2.5,

    /**
     * Precision GPS maxima aceptada.
     */
    precisionMaxima: 100,

    /**
     * Radio en metros para considerar
     * que estamos sobre un punto conocido.
     */
    radioCoincidencia: 8,

    /**
     * Color del marcador.
     */
    colorMarcador: 0x2196f3
};


/* =========================================================
 * PUNTOS DE CALIBRACION
 * ========================================================= */

/**
 * Cada punto contiene:
 *
 * nombre
 * x
 * z
 * latitud
 * longitud
 *
 * Las coordenadas X/Z pertenecen al modelo 3D.
 *
 * Las coordenadas latitud/longitud pertenecen
 * al sistema GPS real.
 */

const PUNTOS_CALIBRACION = [

    {
        nombre: "Almacén y Salón de Taekwondo",
        x: -44.637,
        z: -52.286,
        latitud: 18.865519,
        longitud: -97.718915
    },

    {
        nombre: "Cafetería",
        x: -20.421,
        z: 14.416,
        latitud: 18.864801,
        longitud: -97.721043
    },

    {
        nombre: "Cancha de Béisbol",
        x: 38.550,
        z: -67.475,
        latitud: 18.863444,
        longitud: -97.717329
    },

    {
        nombre: "Cancha de Fútbol",
        x: 6.548,
        z: 37.630,
        latitud: 18.863875,
        longitud: -97.722116
    },

    {
        nombre: "Cancha Techada No. 1",
        x: -35.247,
        z: -0.173,
        latitud: 18.865224,
        longitud: -97.720515
    },

    {
        nombre: "Cancha Techada No. 2",
        x: 25.669,
        z: -31.011,
        latitud: 18.863695,
        longitud: -97.719203
    },

    {
        nombre: "Caseta de Información",
        x: -11.354,
        z: 55.151,
        latitud: 18.864791,
        longitud: -97.722652
    },

    {
        nombre: "Caseta Vigilancia Entrada 3",
        x: -58.812,
        z: 4.036,
        latitud: 18.865760,
        longitud: -97.720568
    },

    {
        nombre: "Caseta Vigilancia Entrada 1",
        x: -23.477,
        z: 66.218,
        latitud: 18.865124,
        longitud: -97.723094
    },

    {
        nombre: "Caseta Vigilancia Entrada 2",
        x: -67.333,
        z: -49.606,
        latitud: 18.866012,
        longitud: -97.719255
    },

    {
        nombre: "Edificio D y Biblioteca",
        x: 13.988,
        z: 20.459,
        latitud: 18.863617,
        longitud: -97.721565
    },

    {
        nombre: "Edificio E",
        x: -34.327,
        z: 17.494,
        latitud: 18.865380,
        longitud: -97.721095
    },

    {
        nombre: "Edificio F",
        x: -4.955,
        z: 19.996,
        latitud: 18.864283,
        longitud: -97.721334
    },

    {
        nombre: "Edificio G",
        x: 14.647,
        z: -8.813,
        latitud: 18.863809,
        longitud: -97.720491
    },

    {
        nombre: "Edificio H",
        x: -34.595,
        z: 32.747,
        latitud: 18.865602,
        longitud: -97.721835
    },

    {
        nombre: "Edificio K",
        x: 37.516,
        z: 20.992,
        latitud: 18.863182,
        longitud: -97.721677
    },

    {
        nombre: "Edificio L",
        x: -20.366,
        z: 1.246,
        latitud: 18.864752,
        longitud: -97.720631
    },

    {
        nombre: "Edificio M",
        x: -35.156,
        z: -17.334,
        latitud: 18.865192,
        longitud: -97.719837
    },

    {
        nombre: "Edificio R",
        x: 26.425,
        z: 5.636,
        latitud: 18.863340,
        longitud: -97.720992
    },

    {
        nombre: "Edificio T",
        x: -4.768,
        z: 1.314,
        latitud: 18.864262,
        longitud: -97.720658
    },

    {
        nombre: "Estacionamiento Oeste",
        x: -44.218,
        z: 59.125,
        latitud: 18.865657,
        longitud: -97.722755
    },

    {
        nombre: "Estacionamiento Norte",
        x: -66.446,
        z: -28.139,
        latitud: 18.865858,
        longitud: -97.719896
    },

    {
        nombre: "Huerta y Composta",
        x: 66.645,
        z: 10.643,
        latitud: 18.861598,
        longitud: -97.721064
    },

    {
        nombre: "Invernaderos",
        x: 53.608,
        z: -30.237,
        latitud: 18.862102,
        longitud: -97.719390
    },

    {
        nombre: "Laboratorio de Serigrafía",
        x: -33.170,
        z: 6.650,
        latitud: 18.865132,
        longitud: -97.720712
    },

    {
        nombre: "Presa de Agua",
        x: -11.267,
        z: -39.786,
        latitud: 18.864739,
        longitud: -97.719165
    }

];


/* =========================================================
 * CONVERSION GPS A METROS LOCALES
 * ========================================================= */

/**
 * Convierte latitud/longitud a metros locales.
 *
 * El primer punto funciona como origen.
 *
 * @param {number} latitud
 * @param {number} longitud
 * @returns {{este:number,norte:number}}
 */
function gpsAMetros(latitud, longitud) {

    const referencia =
        PUNTOS_CALIBRACION[0];


    const metrosLatitud =
        111320;


    const metrosLongitud =
        111320 *
        Math.cos(
            THREE.MathUtils.degToRad(
                referencia.latitud
            )
        );


    const este =
        (longitud - referencia.longitud) *
        metrosLongitud;


    const norte =
        (latitud - referencia.latitud) *
        metrosLatitud;


    return {

        este: este,

        norte: norte
    };
}


/* =========================================================
 * DISTANCIA GPS
 * ========================================================= */

/**
 * Calcula distancia entre dos coordenadas GPS.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number}
 */
function distanciaGPS(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371000;


    const lat1Rad =
        THREE.MathUtils.degToRad(lat1);

    const lat2Rad =
        THREE.MathUtils.degToRad(lat2);


    const deltaLat =
        THREE.MathUtils.degToRad(
            lat2 - lat1
        );


    const deltaLon =
        THREE.MathUtils.degToRad(
            lon2 - lon1
        );


    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;
}


/* =========================================================
 * PUNTO GPS MAS CERCANO
 * ========================================================= */

/**
 * Busca el punto de calibracion mas cercano.
 *
 * @param {number} latitud
 * @param {number} longitud
 * @returns {{punto:Object|null,distancia:number}}
 */
function obtenerPuntoMasCercano(
    latitud,
    longitud
) {

    let puntoCercano = null;

    let distanciaMenor =
        Infinity;


    for (
        const punto of PUNTOS_CALIBRACION
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
 * RESOLVER SISTEMA DE ECUACIONES
 * ========================================================= */

/**
 * Resuelve un sistema de 3 ecuaciones
 * con 3 incógnitas.
 *
 * Se utiliza para obtener la transformación
 * GPS -> modelo.
 *
 * @param {number[][]} A
 * @param {number[]} B
 * @returns {number[]}
 */
function resolverSistema3x3(A, B) {

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
            ) < 0.000000001
        ) {

            throw new Error(
                "Sistema de calibracion degenerado."
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
 * CALCULAR TRANSFORMACION
 * ========================================================= */

/**
 * Calcula la transformación afín utilizando
 * todos los puntos de calibracion.
 *
 * Se utiliza regresion por minimos cuadrados.
 */
function calcularTransformacionGPS() {

    console.log(
        "Calculando transformacion GPS..."
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
        PUNTOS_CALIBRACION.length;


    for (
        const punto of PUNTOS_CALIBRACION
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

        a: coefX[0],
        b: coefX[1],
        c: coefX[2],

        d: coefZ[0],
        e: coefZ[1],
        f: coefZ[2]
    };


    console.log(
        "Transformacion GPS calculada:"
    );

    console.log(
        transformacionGPS
    );


    evaluarCalibracion();
}


/* =========================================================
 * EVALUAR PRECISION
 * ========================================================= */

/**
 * Comprueba cuanto error produce la transformacion
 * sobre cada punto conocido.
 */
function evaluarCalibracion() {

    if (
        !transformacionGPS
    ) {

        return;
    }


    console.log(
        "========================================"
    );

    console.log(
        "ERROR DE CALIBRACION"
    );

    console.log(
        "========================================"
    );


    let errorTotal =
        0;


    for (
        const punto of PUNTOS_CALIBRACION
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
            x - punto.x;


        const errorZ =
            z - punto.z;


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
            "m"
        );
    }


    const errorPromedio =
        errorTotal /
        PUNTOS_CALIBRACION.length;


    console.log(
        "----------------------------------------"
    );


    console.log(
        "Error promedio:",
        errorPromedio.toFixed(3),
        "unidades del modelo"
    );


    console.log(
        "========================================"
    );
}


/* =========================================================
 * CONVERTIR GPS A MODELO
 * ========================================================= */

/**
 * Convierte una coordenada GPS a X/Z.
 *
 * @param {number} latitud
 * @param {number} longitud
 * @returns {THREE.Vector3}
 */
function convertirGPSa3D(
    latitud,
    longitud
) {

    if (
        !transformacionGPS
    ) {

        calcularTransformacionGPS();
    }


    /*
     * Buscar punto conocido.
     */

    const cercano =
        obtenerPuntoMasCercano(
            latitud,
            longitud
        );


    /*
     * Si estamos muy cerca de un punto,
     * utilizamos directamente su coordenada.
     */

    if (
        cercano.punto &&
        cercano.distancia <=
        GPS_CONFIG.radioCoincidencia
    ) {

        console.log(
            "Punto conocido:",
            cercano.punto.nombre
        );


        return new THREE.Vector3(

            cercano.punto.x,

            GPS_CONFIG.alturaMarcador,

            cercano.punto.z
        );
    }


    /*
     * Convertir GPS a metros locales.
     */

    const local =
        gpsAMetros(
            latitud,
            longitud
        );


    /*
     * Aplicar transformación.
     */

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
        "GPS -> MODELO"
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
        "X:",
        x.toFixed(3)
    );

    console.log(
        "Z:",
        z.toFixed(3)
    );


    return new THREE.Vector3(

        x,

        GPS_CONFIG.alturaMarcador,

        z
    );
}


/* =========================================================
 * CREAR MARCADOR
 * ========================================================= */

function crearMarcadorUsuario() {

    if (
        typeof THREE === "undefined" ||
        typeof scene === "undefined" ||
        !scene
    ) {

        console.error(
            "Three.js o scene no estan disponibles."
        );

        return;
    }


    if (
        marcadorUsuario
    ) {

        return;
    }


    marcadorUsuario =
        new THREE.Group();


    marcadorUsuario.name =
        "MarcadorUsuario";


    /*
     * Esfera.
     */

    const geometria =
        new THREE.SphereGeometry(
            GPS_CONFIG.tamanoMarcador * 0.35,
            24,
            24
        );


    const material =
        new THREE.MeshBasicMaterial({

            color:
                GPS_CONFIG.colorMarcador,

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


    /*
     * Aro.
     */

    const geometriaAro =
        new THREE.RingGeometry(
            GPS_CONFIG.tamanoMarcador * 0.55,
            GPS_CONFIG.tamanoMarcador * 0.75,
            32
        );


    const materialAro =
        new THREE.MeshBasicMaterial({

            color:
                GPS_CONFIG.colorMarcador,

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
}


/* =========================================================
 * ACTUALIZAR MARCADOR
 * ========================================================= */

function actualizarMarcadorUsuario(
    posicion
) {

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
        "Marcador:",
        "X =",
        posicion.x.toFixed(3),
        "Z =",
        posicion.z.toFixed(3)
    );
}


/* =========================================================
 * CENTRAR CAMARA
 * ========================================================= */

function centrarCamaraEnUsuario(
    posicion3D
) {

    if (
        typeof camera === "undefined" ||
        typeof controls === "undefined"
    ) {

        console.error(
            "Camera o controls no disponibles."
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
        "Camara centrada en usuario."
    );
}


/* =========================================================
 * ACTUALIZAR UBICACION
 * ========================================================= */

function actualizarUbicacion(
    position
) {

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
        "Precision:",
        precision,
        "metros"
    );


    /*
     * Si el navegador no entrega accuracy,
     * permitimos continuar.
     */

    if (
        precision &&
        precision >
        GPS_CONFIG.precisionMaxima
    ) {

        console.warn(
            "Lectura GPS descartada por baja precision."
        );

        return;
    }


    ultimaPosicionGPS =
        position;


    const posicion3D =
        convertirGPSa3D(
            latitud,
            longitud
        );


    actualizarMarcadorUsuario(
        posicion3D
    );


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
        "Error GPS:",
        error
    );


    switch (
        error.code
    ) {

        case 1:

            console.error(
                "Permiso de ubicacion denegado."
            );

            break;


        case 2:

            console.error(
                "Ubicacion no disponible."
            );

            break;


        case 3:

            console.error(
                "Tiempo de espera agotado."
            );

            break;


        default:

            console.error(
                "Error GPS desconocido."
            );
    }
}


/* =========================================================
 * INICIAR GPS
 * ========================================================= */

function iniciarGPS() {

    console.log(
        "INICIANDO GPS..."
    );


    if (
        !navigator.geolocation
    ) {

        console.error(
            "El navegador no soporta geolocalizacion."
        );

        return;
    }


    crearMarcadorUsuario();


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
     * Primera lectura.
     */

    navigator.geolocation.getCurrentPosition(

        actualizarUbicacion,

        errorGPS,

        {

            enableHighAccuracy:
                true,

            timeout:
                20000,

            maximumAge:
                0
        }
    );


    /*
     * Seguimiento continuo.
     */

    watchIdGPS =
        navigator.geolocation.watchPosition(

            actualizarUbicacion,

            errorGPS,

            {

                enableHighAccuracy:
                    true,

                timeout:
                    20000,

                maximumAge:
                    1000
            }
        );


    gpsActivo =
        true;


    console.log(
        "GPS ACTIVO."
    );
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


    console.log(
        "GPS DETENIDO."
    );
}


/* =========================================================
 * PRUEBA MANUAL
 * ========================================================= */

/**
 * Prueba cualquier coordenada GPS.
 *
 * @param {number} latitud
 * @param {number} longitud
 */
function probarUbicacion(
    latitud,
    longitud
) {

    console.log(
        "========================================"
    );

    console.log(
        "PRUEBA MANUAL GPS"
    );

    console.log(
        "Latitud:",
        latitud
    );

    console.log(
        "Longitud:",
        longitud
    );


    const posicion =
        convertirGPSa3D(
            latitud,
            longitud
        );


    actualizarMarcadorUsuario(
        posicion
    );


    /*
     * Centrar automaticamente durante
     * las pruebas manuales.
     */

    centrarCamaraEnUsuario(
        posicion
    );
}


/* =========================================================
 * PRUEBA PUNTO DE CALIBRACION
 * ========================================================= */

function probarPuntoCalibracion(
    indice
) {

    if (
        indice < 0 ||
        indice >=
        PUNTOS_CALIBRACION.length
    ) {

        console.error(
            "Indice invalido."
        );

        return;
    }


    const punto =
        PUNTOS_CALIBRACION[indice];


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
 * INICIALIZAR CALIBRACION
 * ========================================================= */

calcularTransformacionGPS();


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


window.PUNTOS_CALIBRACION =
    PUNTOS_CALIBRACION;


/* =========================================================
 * BOTON GPS
 * ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const botonUbicacion =
            document.getElementById(
                "btn-ubicacion"
            );


        if (
            !botonUbicacion
        ) {

            console.error(
                "No existe #btn-ubicacion."
            );

            return;
        }


        console.log(
            "Boton GPS conectado."
        );


        botonUbicacion.addEventListener(
            "click",
            function () {

                console.log(
                    "BOTON DE UBICACION PRESIONADO"
                );


                if (
                    !gpsActivo
                ) {

                    /*
                     * La bandera debe activarse
                     * ANTES de iniciar el GPS.
                     */

                    centrarCamaraPendiente =
                        true;


                    iniciarGPS();


                    botonUbicacion.classList.add(
                        "ubicacion-activa"
                    );


                    return;
                }


                /*
                 * Si ya existe una ubicacion,
                 * volver a centrar la camara.
                 */

                if (
                    window.ultimaUbicacionUsuario &&
                    window.ultimaUbicacionUsuario.posicion3D
                ) {

                    centrarCamaraEnUsuario(

                        window
                            .ultimaUbicacionUsuario
                            .posicion3D
                    );
                }

            }
        );
    }
);


console.log(
    "========================================"
);

console.log(
    "MODULO GPS CARGADO"
);

console.log(
    PUNTOS_CALIBRACION.length,
    "puntos de calibracion disponibles."
);

console.log(
    "========================================"
);