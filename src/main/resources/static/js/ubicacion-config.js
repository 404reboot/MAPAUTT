/**
 * =========================================================
 * CONFIGURACIÓN DE UBICACIÓN GPS
 * =========================================================
 *
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 *
 * Sistema:
 *
 * GPS → coordenadas locales del modelo 3D
 *
 * El eje X y Z representan la superficie horizontal
 * del modelo.
 *
 * El eje Y representa únicamente la altura.
 */

/**
 * =========================================================
 * CONFIGURACIÓN GLOBAL
 * =========================================================
 */
const UBICACION_CONFIG = {

    /**
     * =====================================================
     * PUNTOS DE CALIBRACIÓN
     * =====================================================
     *
     * Cada punto contiene:
     *
     * latitud
     * longitud
     * x
     * z
     *
     * Las coordenadas X/Z fueron obtenidas directamente
     * del modelo Mapa_UTTECAM.glb.
     */

    puntosCalibracion: [

        /**
         * Entrada 1
         */
        {
            nombre: "Caseta de Vigilancia de Entrada 1",

            latitud: 18.865175,
            longitud: -97.723098,

            x: -23.4767,
            z: 66.2182
        },

        /**
         * Entrada 2
         */
        {
            nombre: "Caseta de Vigilancia de Entrada 2",

            latitud: 18.865773,
            longitud: -97.720585,

            x: -67.3328,
            z: -49.6055
        },

        /**
         * Entrada 3
         */
        {
            nombre: "Caseta de Vigilancia de Entrada 3",

            latitud: 18.866026,
            longitud: -97.719223,

            x: -58.8118,
            z: 4.0355
        },

        /**
         * Zona verde con fuente
         */
        {
            nombre: "Zona Verde con Fuente",

            latitud: 18.864831,
            longitud: -97.721339,

            x: -21.4970,
            z: 18.8696
        },

        /**
         * Huerta y composta
         */
        {
            nombre: "Huerta y Composta",

            latitud: 18.861603,
            longitud: -97.720929,

            x: 66.6452,
            z: 10.6426
        },

        /**
         * Campo de béisbol
         */
        {
            nombre: "Cancha de Beisbol",

            latitud: 18.863444,
            longitud: -97.717331,

            x: 38.5502,
            z: -67.4750
        },

        /**
         * Presa de agua
         */
        {
            nombre: "Presa de Agua",

            latitud: 18.864648,
            longitud: -97.719097,

            x: -11.2674,
            z: -39.7861
        }
    ],

    /**
     * =====================================================
     * ALTURA DEL MARCADOR
     * =====================================================
     */
    alturaMarcador: 2.0,

    /**
     * =====================================================
     * TAMAÑO DEL MARCADOR
     * =====================================================
     */
    tamañoMarcador: 2.5,

    /**
     * =====================================================
     * PRECISIÓN GPS
     * =====================================================
     *
     * No utilizar posiciones cuya precisión sea peor
     * que 50 metros.
     */
    precisionMinima: 50,

    /**
     * =====================================================
     * ACTUALIZACIÓN GPS
     * =====================================================
     */
    intervaloGPS: 1000
};