/**
 * =========================================================
 * MASCOTA INTERACTIVA
 * Proyecto: Mapa interactivo de la UTTECAM
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 * =========================================================
 */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

/*
 * Tiempo entre mensajes automáticos.
 *
 * 20 segundos = 20000 milisegundos.
 */
const INTERVALO_MENSAJE = 20000;


/*
 * Tiempo que permanece visible
 * cada mensaje.
 */
const DURACION_MENSAJE = 10000;


/* =========================================================
   ELEMENTOS
   ========================================================= */

const mascota =
    document.getElementById("mascota");

const mensaje =
    document.getElementById("mascota-mensaje");

const mensajeTexto =
    document.getElementById("mensaje-texto");


/* =========================================================
   ESTADO DE LA MASCOTA
   ========================================================= */

/*
 * Indica si la mascota principal
 * está actualmente oculta.
 */
let mascotaOculta = false;


/*
 * Indica si el usuario ya interactuó
 * con la página.
 *
 * Esto es importante para permitir
 * sonido en teléfonos.
 */
let audioDesbloqueado = false;


/* =========================================================
   FRASES AMBIENTALES
   ========================================================= */

const frasesAmbientales = [

    "🌱 Cada árbol que cuidamos ayuda a mantener nuestro planeta vivo.",

    "💧 Cuidar el agua hoy significa tener agua mañana.",

    "♻️ Separar nuestros residuos es un pequeño hábito con un gran impacto.",

    "🌎 El planeta no necesita personas perfectas, necesita personas responsables.",

    "🌳 Las áreas verdes ayudan a mejorar nuestro entorno y nuestra calidad de vida.",

    "🚮 Antes de tirar algo, piensa si puede reutilizarse o reciclarse.",

    "💚 Cuidar nuestro campus también es cuidar el planeta.",

    "☀️ Apagar las luces que no utilizamos ayuda a ahorrar energía.",

    "🌿 Una universidad limpia y verde comienza con pequeñas acciones.",

    "🐝 Proteger las plantas también ayuda a proteger a los animales que dependen de ellas.",

    "🌎 Nuestro planeta es nuestra casa. ¡Tratémoslo como tal!",

    "💧 No desperdicies agua. Cada gota cuenta.",

    "♻️ Reducir, reutilizar y reciclar son acciones que todos podemos realizar.",

    "🌱 Plantar un árbol es pensar en las generaciones que todavía no conocemos.",

    "💚 Mantener limpio nuestro entorno es responsabilidad de todos."

];


/* =========================================================
   CONTROL DE FRASES
   ========================================================= */

let ultimaFrase = -1;


/* =========================================================
   OBTENER FRASE ALEATORIA
   ========================================================= */

function obtenerFrase() {

    let indice;


    do {

        indice = Math.floor(
            Math.random() *
            frasesAmbientales.length
        );

    } while (
        indice === ultimaFrase &&
        frasesAmbientales.length > 1
    );


    ultimaFrase = indice;


    return frasesAmbientales[indice];

}


/* =========================================================
   SISTEMA DE AUDIO
   ========================================================= */

let audioContext = null;


/*
 * Inicializa el contexto de audio.
 */
function inicializarAudio() {

    try {

        if (!audioContext) {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContext) {

                console.warn(
                    "El navegador no soporta Web Audio API."
                );

                return false;

            }


            audioContext =
                new AudioContext();

        }


        /*
         * Reanudar si estaba suspendido.
         */
        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }


        return true;

    } catch (error) {

        console.warn(
            "No fue posible inicializar el audio.",
            error
        );

        return false;

    }

}


/* =========================================================
   DESBLOQUEAR AUDIO EN CELULARES
   ========================================================= */

function desbloquearAudio() {

    try {

        if (!inicializarAudio()) {

            return;

        }


        /*
         * Crear un sonido prácticamente inaudible.
         *
         * Esto permite que algunos navegadores
         * móviles consideren que el audio fue
         * iniciado por una interacción del usuario.
         */

        const oscilador =
            audioContext.createOscillator();

        const ganancia =
            audioContext.createGain();


        oscilador.type =
            "sine";


        oscilador.frequency.value =
            1;


        ganancia.gain.value =
            0.0001;


        oscilador.connect(
            ganancia
        );


        ganancia.connect(
            audioContext.destination
        );


        const tiempo =
            audioContext.currentTime;


        oscilador.start(
            tiempo
        );


        oscilador.stop(
            tiempo + 0.01
        );


        audioDesbloqueado =
            true;

    } catch (error) {

        console.warn(
            "No fue posible desbloquear el audio.",
            error
        );

    }

}


/* =========================================================
   REPRODUCIR SONIDO
   ========================================================= */

function reproducirSonido() {

    /*
     * Si el usuario todavía no interactuó,
     * no intentamos reproducir audio automático.
     */

    if (!audioDesbloqueado) {

        return;

    }


    if (!inicializarAudio()) {

        return;

    }


    try {

        const ahora =
            audioContext.currentTime;


        /* =================================================
           PRIMER TONO
           ================================================= */

        const oscilador1 =
            audioContext.createOscillator();

        const ganancia1 =
            audioContext.createGain();


        oscilador1.type =
            "sine";


        oscilador1.frequency.setValueAtTime(
            660,
            ahora
        );


        oscilador1.frequency.exponentialRampToValueAtTime(
            880,
            ahora + 0.12
        );


        ganancia1.gain.setValueAtTime(
            0.0001,
            ahora
        );


        ganancia1.gain.exponentialRampToValueAtTime(
            0.15,
            ahora + 0.02
        );


        ganancia1.gain.exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.18
        );


        oscilador1.connect(
            ganancia1
        );


        ganancia1.connect(
            audioContext.destination
        );


        oscilador1.start(
            ahora
        );


        oscilador1.stop(
            ahora + 0.18
        );


        /* =================================================
           SEGUNDO TONO
           ================================================= */

        const oscilador2 =
            audioContext.createOscillator();

        const ganancia2 =
            audioContext.createGain();


        oscilador2.type =
            "sine";


        oscilador2.frequency.setValueAtTime(
            880,
            ahora + 0.08
        );


        oscilador2.frequency.exponentialRampToValueAtTime(
            1046,
            ahora + 0.22
        );


        ganancia2.gain.setValueAtTime(
            0.0001,
            ahora + 0.08
        );


        ganancia2.gain.exponentialRampToValueAtTime(
            0.12,
            ahora + 0.10
        );


        ganancia2.gain.exponentialRampToValueAtTime(
            0.0001,
            ahora + 0.25
        );


        oscilador2.connect(
            ganancia2
        );


        ganancia2.connect(
            audioContext.destination
        );


        oscilador2.start(
            ahora + 0.08
        );


        oscilador2.stop(
            ahora + 0.25
        );


    } catch (error) {

        console.warn(
            "No fue posible reproducir el sonido.",
            error
        );

    }

}


/* =========================================================
   MOSTRAR MENSAJE
   ========================================================= */

let temporizadorMensaje = null;


function mascotaHabla() {

    /*
     * Si la mascota está oculta porque
     * se está mostrando información,
     * no hacemos nada.
     */

    if (mascotaOculta) {

        return;

    }


    if (
        !mascota ||
        !mensaje ||
        !mensajeTexto
    ) {

        return;

    }


    /*
     * Obtener frase.
     */

    const frase =
        obtenerFrase();


    mensajeTexto.textContent =
        frase;


    /*
     * Sonido.
     */

    reproducirSonido();


    /*
     * Reiniciar animación.
     */

    mascota.classList.remove(
        "hablando"
    );


    void mascota.offsetWidth;


    mascota.classList.add(
        "hablando"
    );


    /*
     * Mostrar burbuja.
     */

    mensaje.classList.add(
        "visible"
    );


    /*
     * Reiniciar temporizador.
     */

    clearTimeout(
        temporizadorMensaje
    );


    temporizadorMensaje =
        setTimeout(() => {

            mensaje.classList.remove(
                "visible"
            );


            mascota.classList.remove(
                "hablando"
            );


        }, DURACION_MENSAJE);

}


function ocultarMascotaPrincipal() {

    if (!mascota) {
        return;
    }

    /*
     * La mascota solamente se oculta
     * en dispositivos móviles.
     */
    if (window.innerWidth > 768) {

        mascotaOculta = false;

        return;
    }

    mascotaOculta = true;

    /*
     * Ocultar la burbuja.
     */
    if (mensaje) {

        mensaje.classList.remove("visible");

    }

    /*
     * Detener la animación de habla.
     */
    mascota.classList.remove("hablando");

    /*
     * Ocultar mascota.
     */
    mascota.classList.add("mascota-oculta");
}


function mostrarMascotaPrincipal() {

    if (!mascota) {
        return;
    }

    /*
     * En computadora la mascota
     * siempre debe permanecer visible.
     */
    if (window.innerWidth > 768) {

        mascotaOculta = false;

        mascota.classList.remove(
            "mascota-oculta"
        );

        return;
    }

    /*
     * En celular vuelve a mostrarse
     * cuando se cierra la información.
     */
    mascotaOculta = false;

    mascota.classList.remove(
        "mascota-oculta"
    );
}


function actualizarEstadoMascota() {

    const tarjeta =
        document.querySelector(
            ".floating-details-card"
        );

    /*
     * En computadora la mascota
     * nunca se oculta.
     */
    if (window.innerWidth > 768) {

        mostrarMascotaPrincipal();

        return;
    }

    /*
     * En celular sí depende del estado
     * de la tarjeta.
     */
    if (!tarjeta) {

        mostrarMascotaPrincipal();

        return;
    }

    if (
        tarjeta.classList.contains("visible")
    ) {

        ocultarMascotaPrincipal();

    } else {

        mostrarMascotaPrincipal();

    }
}

/* =========================================================
   OBSERVAR CAMBIOS DE LA TARJETA
   ========================================================= */

/*
 * Esto permite detectar automáticamente
 * cuando otro código agrega o elimina
 * la clase "visible".
 */

const observadorTarjeta =
    new MutationObserver(() => {

        actualizarEstadoMascota();

    });


/*
 * Esperamos a que exista la tarjeta.
 */

function iniciarObservadorTarjeta() {

    const tarjeta =
        document.querySelector(
            ".floating-details-card"
        );


    if (!tarjeta) {

        return;

    }


    observadorTarjeta.observe(
        tarjeta,
        {
            attributes: true,

            attributeFilter: [
                "class"
            ]
        }
    );


    /*
     * Comprobar estado inicial.
     */

    actualizarEstadoMascota();

}


iniciarObservadorTarjeta();


/* =========================================================
   INTERACCIÓN CON LA MASCOTA
   Compatible con PC y celular
   ========================================================= */

if (mascota) {

    mascota.addEventListener(
        "pointerdown",
        (evento) => {

            /*
             * Si está oculta no hacemos nada.
             */

            if (mascotaOculta) {

                return;

            }


            evento.preventDefault();


            /*
             * Desbloquear audio por interacción
             * directa del usuario.
             */

            desbloquearAudio();


            /*
             * Inicializar audio.
             */

            inicializarAudio();


            /*
             * Efecto visual.
             */

            mascota.classList.add(
                "tocando"
            );


            /*
             * Hacer que hable.
             */

            mascotaHabla();


            /*
             * Quitar efecto.
             */

            setTimeout(() => {

                mascota.classList.remove(
                    "tocando"
                );

            }, 300);

        },

        {
            passive: false
        }

    );

}


/* =========================================================
   MENSAJES AUTOMÁTICOS
   ========================================================= */

setInterval(() => {

    /*
     * Si la mascota está oculta,
     * no muestra mensajes.
     */

    if (
        !mascotaOculta
    ) {

        mascotaHabla();

    }

}, INTERVALO_MENSAJE);


/* =========================================================
   PRIMER MENSAJE
   ========================================================= */

setTimeout(() => {

    if (
        !mascotaOculta
    ) {

        mascotaHabla();

    }

}, 5000);