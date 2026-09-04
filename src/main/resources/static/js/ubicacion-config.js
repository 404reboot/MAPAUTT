 /**
 * =========================================================
 * CONFIGURACION DEL SISTEMA GPS
 * =========================================================
 *
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 *
 * Descripcion:
 * Contiene la configuracion y los puntos de referencia
 * utilizados para convertir coordenadas GPS reales
 * a coordenadas X/Z dentro del modelo 3D.
 */


/* =========================================================
 * CONFIGURACION PRINCIPAL
 * ========================================================= */

const GPS_CONFIG = {

    /**
     * Altura del marcador respecto al modelo.
     */
    alturaMarcador: .3,

    /**
     * Tamaño general del marcador.
     */
    tamanoMarcador: 2.5,

    /**
     * Precision GPS maxima aceptada en metros.
     *
     * Ejemplo:
     * 20 = solamente acepta lecturas con precision
     * igual o menor a 20 metros.
     *
     * Para pruebas se mantienen 100 metros.
     */
    precisionMaxima: 100,

    /**
     * Radio en metros para considerar que el usuario
     * esta sobre un punto de referencia conocido.
     */
    radioCoincidencia: 8,

    /**
     * Color del marcador GPS.
     */
    colorMarcador: 0x2196f3

};


/* =========================================================
 * PUNTOS DE REFERENCIA
 * ========================================================= */

/**
 * Cada punto contiene:
 *
 * nombre     = Nombre del elemento.
 * x          = Coordenada X del modelo 3D.
 * z          = Coordenada Z del modelo 3D.
 * latitud    = Latitud GPS real.
 * longitud   = Longitud GPS real.
 *
 * Estos puntos sirven como referencias para calcular
 * la posicion del usuario dentro del modelo.
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
 * EXPORTACION
 * ========================================================= */

/**
 * Hacer disponibles las configuraciones para otros
 * archivos JavaScript del proyecto.
 */

window.GPS_CONFIG =
    GPS_CONFIG;

window.PUNTOS_CALIBRACION =
    PUNTOS_CALIBRACION;


console.log(
    "========================================"
);

console.log(
    "CONFIGURACION GPS CARGADA"
);

console.log(
    PUNTOS_CALIBRACION.length,
    "puntos de referencia disponibles."
);

console.log(
    "========================================"
);

