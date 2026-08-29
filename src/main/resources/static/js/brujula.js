/*
    Autor: Cristobal Torres Ramos
    Proyecto: Mapa interactivo de la UTTECAM
    Año: 2026
    Versión: 1.0
    Descripción:
    Controla el movimiento de la flecha de la brújula
    utilizando la orientación real de la cámara de Three.js.
*/

(function () {

    'use strict';

    let compassArrow = null;

    /*
     * Inicializa la brújula.
     */
    function initCompass() {

        compassArrow = document.getElementById('compass-arrow');

        if (!compassArrow) {
            console.warn(
                'Brújula: no se encontró #compass-arrow.'
            );
            return;
        }

        console.log(
            'Brújula: sistema inicializado correctamente.'
        );
    }


    /*
     * Actualiza la dirección de la flecha.
     *
     * La dirección se obtiene a partir de la posición
     * de la cámara respecto al punto hacia donde mira.
     */
    function updateCompass() {

    if (
        !compassArrow ||
        typeof camera === 'undefined' ||
        typeof controls === 'undefined'
    ) {
        return;
    }

    /*
     * Diferencia horizontal entre la cámara
     * y el punto hacia donde está mirando.
     */
    const dx =
        camera.position.x -
        controls.target.x;

    const dz =
        camera.position.z -
        controls.target.z;


    /*
     * Calcula la orientación horizontal.
     */
    let angle =
        Math.atan2(dx, dz) *
        (180 / Math.PI);


    /*
     * Corrección de la orientación del mapa.
     *
     * El Norte del mapa corresponde al Este geográfico.
     */
    angle -= 90;


    /*
     * Invierte el sentido de giro para que
     * la flecha acompañe correctamente la
     * dirección de giro del mapa.
     */
    angle = -angle;


    /*
     * Normaliza el resultado entre 0° y 360°.
     */
    angle %= 360;

    if (angle < 0) {
        angle += 360;
    }


    /*
     * Aplica la rotación manteniendo la flecha
     * centrada en la brújula.
     */
    compassArrow.style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}


    /*
     * Inicialización cuando el DOM está listo.
     */
    document.addEventListener(
        'DOMContentLoaded',
        function () {

            initCompass();

        }
    );


    /*
     * Exponemos la función para que mapa.js
     * pueda actualizar la brújula.
     */
    window.updateCompass =
        updateCompass;

})();