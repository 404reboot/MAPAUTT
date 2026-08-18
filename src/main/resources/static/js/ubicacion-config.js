/**
 * =========================================================
 * CONFIGURACIÓN DE UBICACIÓN GPS
 * =========================================================
 *
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 *
<<<<<<< HEAD
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
=======
 * Sistema de conversión:
 *
 * GPS → coordenadas locales del modelo 3D
 *
 * El eje X representa el desplazamiento horizontal
 * del modelo.
 *
 * El eje Z representa el segundo eje horizontal
 * del modelo.
 *
 * El eje Y se utiliza únicamente para la altura.
 */

/**
 * Configuración global del sistema GPS.
>>>>>>> a90eee181a4be4e37eb55551fd63e1792960575a
 */
const UBICACION_CONFIG = {

    /**
     * =====================================================
<<<<<<< HEAD
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
=======
     * ORIGEN GPS
     * =====================================================
     *
     * Utilizamos la Entrada 1 como punto de referencia.
     */
    origenGPS: {

        latitud: 18.865175,

        longitud: -97.723098
    },


    /**
     * =====================================================
     * ORIGEN DEL MODELO 3D
     * =====================================================
     *
     * Posición de la Entrada 1 dentro del modelo 3D.
     *
     * Entrada 1:
     * GPS: 18.865175, -97.723098
     * 3D:  X = -25
     *      Z = 70
     */
    origen3D: {

        x: -25,

        z: 70
    },


    /**
     * =====================================================
     * CONVERSIÓN GPS → X
     * =====================================================
     *
     * Estos valores relacionan los desplazamientos
     * de longitud y latitud con el eje X del modelo.
     *
     * IMPORTANTE:
     * Los valores están calculados utilizando como
     * referencia los puntos proporcionados.
     */
    conversionX: {

        /**
         * Cambio de X por grado de longitud.
         */
        metrosEste: -596.72222719,

        /**
         * Cambio de X por grado de latitud.
         */
        metrosNorte: -27051.84146866
    },


    /**
     * =====================================================
     * CONVERSIÓN GPS → Z
     * =====================================================
     *
     * Relación entre GPS y el eje Z del modelo.
     */
    conversionZ: {

        /**
         * Cambio de Z por grado de longitud.
         */
        metrosEste: -31933.56065021,

        /**
         * Cambio de Z por grado de latitud.
         */
        metrosNorte: -6490.73143512
    },

>>>>>>> a90eee181a4be4e37eb55551fd63e1792960575a

    /**
     * =====================================================
     * ALTURA DEL MARCADOR
     * =====================================================
     */
<<<<<<< HEAD
    alturaMarcador: 2.0,
=======
    alturaMarcador: 2,

>>>>>>> a90eee181a4be4e37eb55551fd63e1792960575a

    /**
     * =====================================================
     * TAMAÑO DEL MARCADOR
     * =====================================================
     */
    tamañoMarcador: 2.5,

<<<<<<< HEAD
    /**
     * =====================================================
     * PRECISIÓN GPS
     * =====================================================
     *
     * No utilizar posiciones cuya precisión sea peor
     * que 50 metros.
     */
    precisionMinima: 50,

=======

    /**
     * =====================================================
     * PRECISIÓN GPS MÁXIMA ACEPTABLE
     * =====================================================
     *
     * Si el GPS tiene una precisión peor que este valor,
     * podemos considerar que la posición no es confiable.
     *
     * Valor expresado en metros.
     */
    precisionMinima: 50,


>>>>>>> a90eee181a4be4e37eb55551fd63e1792960575a
    /**
     * =====================================================
     * ACTUALIZACIÓN GPS
     * =====================================================
<<<<<<< HEAD
=======
     *
     * Tiempo aproximado entre actualizaciones.
>>>>>>> a90eee181a4be4e37eb55551fd63e1792960575a
     */
    intervaloGPS: 1000
};