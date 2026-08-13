/**
 * =========================================================
 * CONFIGURACIÓN DE UBICACIÓN GPS
 * =========================================================
 *
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 *
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
 */
const UBICACION_CONFIG = {

    /**
     * =====================================================
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


    /**
     * =====================================================
     * ALTURA DEL MARCADOR
     * =====================================================
     */
    alturaMarcador: 2,


    /**
     * =====================================================
     * TAMAÑO DEL MARCADOR
     * =====================================================
     */
    tamañoMarcador: 2.5,


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


    /**
     * =====================================================
     * ACTUALIZACIÓN GPS
     * =====================================================
     *
     * Tiempo aproximado entre actualizaciones.
     */
    intervaloGPS: 1000
};