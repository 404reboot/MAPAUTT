document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTOS PRINCIPALES
    // =====================================================

    const mainContent = document.getElementById("main-content");

    const btnShowAdmin = document.getElementById("show-admin");

    const btnShowMap = document.getElementById("show-map");

    // =====================================================
    // VALIDACIÓN
    // =====================================================

    if (!mainContent) {
        console.error(
            "MAPAUTT: No se encontró el elemento #main-content."
        );

        return;
    }

    if (!btnShowAdmin) {
        console.error(
            "MAPAUTT: No se encontró el botón #show-admin."
        );
    }

    if (!btnShowMap) {
        console.error(
            "MAPAUTT: No se encontró el botón #show-map."
        );
    }

    // =====================================================
    // ESTADO INICIAL
    // =====================================================

    mainContent.classList.remove("admin-expanded");

    mainContent.classList.add("map-expanded");

    // =====================================================
    // MOSTRAR ADMINISTRACIÓN
    // =====================================================

    if (btnShowAdmin) {

        btnShowAdmin.addEventListener("click", () => {

            // Evita que se ejecuten cambios innecesarios
            if (mainContent.classList.contains("admin-expanded")) {
                return;
            }

            // Cambiamos el estado visual
            mainContent.classList.remove("map-expanded");

            mainContent.classList.add("admin-expanded");

        });
    }

    // =====================================================
    // VOLVER AL MAPA
    // =====================================================

    if (btnShowMap) {

        btnShowMap.addEventListener("click", () => {

            // Evita cambios innecesarios
            if (mainContent.classList.contains("map-expanded")) {
                return;
            }

            // Regresamos al estado mapa
            mainContent.classList.remove("admin-expanded");

            mainContent.classList.add("map-expanded");

        });
    }

    // =====================================================
    // SOPORTE PARA TECLADO
    // =====================================================

    document.addEventListener("keydown", (event) => {

        // Flecha derecha = administración
        if (
            event.key === "ArrowRight" &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.shiftKey
        ) {

            if (
                document.activeElement.tagName !== "INPUT" &&
                document.activeElement.tagName !== "TEXTAREA"
            ) {

                mainContent.classList.remove("map-expanded");

                mainContent.classList.add("admin-expanded");
            }
        }

        // Flecha izquierda = mapa
        if (
            event.key === "ArrowLeft" &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.shiftKey
        ) {

            if (
                document.activeElement.tagName !== "INPUT" &&
                document.activeElement.tagName !== "TEXTAREA"
            ) {

                mainContent.classList.remove("admin-expanded");

                mainContent.classList.add("map-expanded");
            }
        }

    });

});


















document.addEventListener('DOMContentLoaded', () => {
    const metaClock = document.querySelector('.welcome-meta');
    if (metaClock) {
        // Iniciar en modo burbuja compacta en pantallas móviles
        if (window.innerWidth <= 768) {
            metaClock.classList.add('bubble-collapsed');
        }

        // Alternar entre burbuja e información completa al hacer clic/tocar
        metaClock.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                metaClock.classList.toggle('bubble-collapsed');
                metaClock.classList.toggle('expanded');
            }
        });
    }
});