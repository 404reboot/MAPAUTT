/*
    Autor: Cristobal Torres Ramos
    Proyecto: Mapa interactivo de la UTTECAM
*/

let scene, camera, renderer, controls;
let raycaster, mouse;
let interactiveObjects = [];
let hoveredObject = null;
let selectedObject = null;
let composer, outlinePass;
let dbItemsMap = new Map();











/* =========================================================
   SISTEMA DE EXPLORACIÓN Y ETIQUETAS DEL MAPA
   ========================================================= */

let mapModel = null;

let mapLabels = [];

const activeExploreCategories = new Set();

const ALWAYS_VISIBLE_CATEGORY = 'entradas';


/*
 * Prefijos que representan áreas comunes.
 *
 * Puedes agregar o quitar nombres dependiendo
 * de cómo estén nombrados los objetos dentro del GLB.
 */
const COMMON_PREFIXES = [
    'Zona_',
    'Cancha_',
    'Pasillos_'
];


/*
 * Prefijos que representan espacios naturales.
 */
const NATURAL_PREFIXES = [
    'Area_',
    'Huerta_',
    'Invernaderos_',
    'Presa_'
];


/*
 * Palabras utilizadas para detectar entradas.
 *
 * Si tus objetos del Blender tienen nombres diferentes,
 * solamente agrega aquí la palabra correspondiente.
 */
const ENTRANCE_KEYWORDS = [
    'entrada',
    'acceso',
    'porton',
    'puerta',
    'caseta'
];














let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let isPointerDownOnCanvas = false;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

const container = document.getElementById('webgl-container');
const tooltip = document.getElementById('map-tooltip');
const detailsCard = document.getElementById('details-card');

function normalizeKey(str) {
    if (!str) return '';
    return str.toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\-_]+/g, '_');
}
/* =========================================================
   CARGAR TODOS LOS DATOS DEL MAPA
   ========================================================= */

/**
 * Carga todos los registros disponibles
 * desde la base de datos.
 *
 * No limita la información a categorías específicas.
 *
 * @author Cristobal Torres Ramos
 * @version 1.4
 */
function loadDbMapData() {

    fetch(
        '/api/map-data'
    )

        .then(
            function (response) {

                if (!response.ok) {

                    throw new Error(
                        'No se pudieron cargar los datos del mapa.'
                    );

                }

                return response.json();

            }
        )

        .then(
            function (data) {

                dbItemsMap.clear();


                /*
                 * Recorrer TODAS las propiedades
                 * devueltas por Spring Boot.
                 */
                Object.keys(
                    data
                ).forEach(
                    function (categoria) {

                        const elementos =
                            data[
                            categoria
                            ];


                        /*
                         * Solo procesamos arreglos.
                         */
                        if (
                            !Array.isArray(
                                elementos
                            )
                        ) {

                            return;

                        }


                        elementos.forEach(
                            function (item) {

                                if (!item) {
                                    return;
                                }


                                const entry = {

                                    type:
                                        obtenerTipoResultado(
                                            categoria
                                        ),

                                    categoria:
                                        categoria,

                                    data:
                                        item,

                                    nombre:
                                        obtenerNombreResultado(
                                            item
                                        )

                                };


                                /*
                                 * Registrar por codigoMesh.
                                 */
                                if (
                                    item.codigoMesh
                                ) {

                                    dbItemsMap.set(

                                        normalizeKey(
                                            item.codigoMesh
                                        ),

                                        entry

                                    );

                                }


                                /*
                                 * Registrar por nombre.
                                 */
                                if (
                                    item.nombre
                                ) {

                                    dbItemsMap.set(

                                        normalizeKey(
                                            item.nombre
                                        ),

                                        entry

                                    );

                                }

                            }
                        );

                    }
                );


                console.log(
                    'Datos del mapa cargados:',
                    dbItemsMap.size
                );

            }
        )

        .catch(
            function (error) {

                console.error(
                    'Error al cargar datos del mapa:',
                    error
                );

            }
        );

}

function findDbItemForMesh(object) {
    if (!object || !dbItemsMap || dbItemsMap.size === 0) return null;

    let current = object;
    const candidateNames = [];

    while (current && current !== scene) {
        if (current.name) {
            candidateNames.push(current.name);
        }
        current = current.parent;
    }

    for (let rawName of candidateNames) {
        let key = normalizeKey(rawName);
        if (dbItemsMap.has(key)) {
            return dbItemsMap.get(key);
        }

        let strippedNumber = rawName.replace(/_[0-9]+$/, '').replace(/_+$/, '');
        let keyStripped = normalizeKey(strippedNumber);
        if (dbItemsMap.has(keyStripped)) {
            return dbItemsMap.get(keyStripped);
        }

        let noPrefix = rawName.replace(/^(Edificio_|Zona_|Area_|Caseta_|Almacen_|Laboratorio_|Cafeteria_|Invernaderos_|Huerta_|Presa_|Cancha_|Biblioteca_|Estacionamiento_|Camino_|Pasillos_)/i, '');
        let keyNoPrefix = normalizeKey(noPrefix);
        if (dbItemsMap.has(keyNoPrefix)) {
            return dbItemsMap.get(keyNoPrefix);
        }

        let noPrefixStripped = noPrefix.replace(/_[0-9]+$/, '').replace(/_+$/, '');
        let keyNoPrefixStripped = normalizeKey(noPrefixStripped);
        if (dbItemsMap.has(keyNoPrefixStripped)) {
            return dbItemsMap.get(keyNoPrefixStripped);
        }
    }

    return null;
}

// Actualiza los objetos iluminados con el contorno de selección (manteniendo el objeto activo y el hovered)
function updateOutlines() {
    if (!outlinePass) return;
    const list = [];
    if (selectedObject) {
        list.push(selectedObject);
    }
    if (hoveredObject && hoveredObject !== selectedObject) {
        list.push(hoveredObject);
    }
    outlinePass.selectedObjects = list;
}


























/* =========================================================
   SISTEMA DE ETIQUETAS DEL MAPA
   ========================================================= */

/**
 * Crea la capa HTML donde se mostrarán las etiquetas.
 */
function createMapLabelLayer() {

    let layer = document.getElementById('map-label-layer');

    if (layer) {
        return layer;
    }

    layer = document.createElement('div');

    layer.id = 'map-label-layer';

    layer.className = 'map-label-layer';

    container.appendChild(layer);

    return layer;
}


/**
 * Determina si un objeto corresponde a una entrada.
 */
function isEntranceObject(object) {

    if (!object) {
        return false;
    }

    let current = object;

    while (current && current !== scene) {

        const name = (current.name || '').toLowerCase();

        if (
            ENTRANCE_KEYWORDS.some(keyword =>
                name.includes(keyword)
            )
        ) {
            return true;
        }

        current = current.parent;
    }

    return false;
}


/* =========================================================
   DETERMINAR CATEGORÍA DE OBJETO
   ========================================================= */

function getExploreCategory(
    object,
    dbItem = null
) {

    if (!object) {
        return null;
    }


    /* ---------------------------------------------
       Construir texto completo para buscar
       --------------------------------------------- */

    let names = [];


    let current = object;


    while (
        current &&
        current !== scene
    ) {

        if (current.name) {

            names.push(
                current.name
            );
        }

        current =
            current.parent;
    }


    /* ---------------------------------------------
       Agregar nombre de BD
       --------------------------------------------- */

    if (
        dbItem &&
        dbItem.nombre
    ) {

        names.push(
            dbItem.nombre
        );
    }


    if (
        dbItem &&
        dbItem.codigoMesh
    ) {

        names.push(
            dbItem.codigoMesh
        );
    }


    const fullName =
        names
            .join(' ')
            .toLowerCase();


    /* =================================================
       ENTRADAS
       ================================================= */

    const entranceKeywords = [

        'caseta',
        'caseta_',
        'caseta de vigilancia',
        'caseta_de_vigilancia'

    ];


    if (
        entranceKeywords.some(
            keyword =>
                fullName.includes(
                    keyword
                )
        )
    ) {

        return 'entradas';
    }


    /* =================================================
       ESPACIOS NATURALES
       ================================================= */

    const naturalPrefixes = [

        'area_',

        'área_',

        'zona_verde_',

        'huerta_',

        'invernadero_',

        'invernaderos_',

        'presa_',

        'jardin_',

        'jardín_'

    ];


    if (
        naturalPrefixes.some(
            prefix =>
                names.some(name =>
                    name
                        .toLowerCase()
                        .startsWith(prefix)
                )
        )
    ) {

        return 'naturales';
    }


    /* =================================================
       ÁREAS COMUNES
       ================================================= */

    const commonPrefixes = [

        'cafeteria_',

        'cancha_',

        'pasillos_',

        'plaza_',

        'convivencia_',

        'area_comun_'

    ];


    if (
        commonPrefixes.some(
            prefix =>
                names.some(name =>
                    name
                        .toLowerCase()
                        .startsWith(prefix)
                )
        )
    ) {

        return 'comunes';
    }


    /* =================================================
       INFRAESTRUCTURA
       ================================================= */

    const infrastructurePrefixes = [

        'edificio_',

        'biblioteca_',

        'laboratorio_',

        'cafeteria_',

        'cafetería_',

        'estacionamiento_',

        'caseta_',

        'almacen_',

        'almacén_'

    ];


    if (
        infrastructurePrefixes.some(
            prefix =>
                names.some(name =>
                    name
                        .toLowerCase()
                        .startsWith(prefix)
                )
        )
    ) {

        return 'infraestructura';
    }


    return null;
}


/**
 * Obtiene una posición adecuada para colocar
 * la burbuja sobre el objeto.
 */
function getLabelWorldPosition(object) {

    const box = new THREE.Box3();

    box.setFromObject(object);

    const center = box.getCenter(
        new THREE.Vector3()
    );

    /*
     * Elevamos la etiqueta ligeramente
     * para que aparezca encima de la estructura.
     */
    center.y += box.getSize(
        new THREE.Vector3()
    ).y * 0.5;

    return center;
}


/* =========================================================
   CREAR ETIQUETA
   ========================================================= */

function createMapLabel(object, dbItem) {

    if (!object) {
        return;
    }


    /* ---------------------------------------------
       Determinar categoría
       --------------------------------------------- */

    let category =
        getExploreCategory(
            object,
            dbItem
        );


    if (!category) {
        return;
    }


    /* ---------------------------------------------
       Evitar duplicados
       --------------------------------------------- */

    if (
        mapLabels.some(label =>
            label.object === object
        )
    ) {
        return;
    }


    /* ---------------------------------------------
       Crear capa
       --------------------------------------------- */

    const layer =
        createMapLabelLayer();


    /* ---------------------------------------------
       Crear elemento HTML
       --------------------------------------------- */

    const label =
        document.createElement('div');


    label.classList.add(
        'map-object-label'
    );


    /* ---------------------------------------------
       Estilo según categoría
       --------------------------------------------- */

    if (
        category === 'entradas'
    ) {

        label.classList.add(
            'entrance'
        );

    } else if (
        category === 'infraestructura'
    ) {

        label.classList.add(
            'infrastructure'
        );

    } else if (
        category === 'comunes'
    ) {

        label.classList.add(
            'common'
        );

    } else if (
        category === 'naturales'
    ) {

        label.classList.add(
            'natural'
        );
    }


    /* ---------------------------------------------
       Punto de color
       --------------------------------------------- */

    const dot =
        document.createElement('span');


    dot.className =
        'map-label-dot';


    /* ---------------------------------------------
       Texto
       --------------------------------------------- */

    const text =
        document.createElement('span');


    let labelText =
        null;


    if (
        dbItem &&
        dbItem.nombre
    ) {

        labelText =
            dbItem.nombre;

    } else if (
        object.name
    ) {

        labelText =
            formatName(
                object.name
            );

    } else {

        labelText =
            'Sin nombre';
    }


    text.textContent =
        labelText;


    /* ---------------------------------------------
       Construir etiqueta
       --------------------------------------------- */

    label.appendChild(dot);

    label.appendChild(text);

    layer.appendChild(label);


    /* ---------------------------------------------
       Guardar referencia
       --------------------------------------------- */

    mapLabels.push({

        object: object,

        element: label,

        category: category,

        position:
            new THREE.Vector3(),

        dbItem: dbItem

    });
}













/* =========================================================
   MENÚ EXPLORAR
   ========================================================= */
/* =========================================================
   MENÚ EXPLORAR
   ========================================================= */

/**
 * Configura todas las interacciones del menú Explorar.
 *
 * Incluye:
 * - Abrir y cerrar el menú.
 * - Cerrar mediante el botón X.
 * - Seleccionar categorías.
 * - Cerrar al hacer clic fuera.
 *
 * Autor: Cristobal Torres Ramos
 * Año: 2026
 * Versión: 1.3
 */
function setupExploreMenu() {

    const exploreButton =
        document.getElementById(
            'btn-explore'
        );


    const exploreMenu =
        document.getElementById(
            'explore-menu'
        );


    const options =
        document.querySelectorAll(
            '.explore-option'
        );


    /*
     * Verificar que los elementos principales
     * existan antes de continuar.
     */
    if (
        !exploreButton ||
        !exploreMenu
    ) {

        console.warn(
            'Menú Explorar: no se encontraron los elementos necesarios.'
        );

        return;
    }


    /* =====================================================
       ABRIR / CERRAR MENÚ
       ===================================================== */

    exploreButton.addEventListener(
        'click',
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                exploreMenu.classList.contains(
                    'open'
                );


            if (isOpen) {

                closeExploreMenu();

            } else {

                openExploreMenu();

            }

        }
    );


    /* =====================================================
       BOTÓN X
       ===================================================== */

    exploreMenu.addEventListener(
        'click',
        function (event) {

            /*
             * Buscar si el elemento pulsado pertenece
             * al botón de cerrar.
             */
            const closeButton =
                event.target.closest(
                    '#btn-close-explore'
                );


            if (closeButton) {

                event.preventDefault();

                event.stopPropagation();

                closeExploreMenu();

                return;
            }


            /*
             * Evitar que los demás elementos del menú
             * propaguen el clic hacia el documento.
             */
            event.stopPropagation();

        }
    );


    /* =====================================================
       SELECCIONAR CATEGORÍAS
       ===================================================== */

    options.forEach(option => {

        option.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const category =
                    option.dataset.category;


                /*
                 * Activar / desactivar categoría.
                 */
                if (
                    activeExploreCategories.has(
                        category
                    )
                ) {

                    activeExploreCategories.delete(
                        category
                    );

                    option.classList.remove(
                        'active'
                    );

                } else {

                    activeExploreCategories.add(
                        category
                    );

                    option.classList.add(
                        'active'
                    );

                }


                /*
                 * Actualizar inmediatamente
                 * las etiquetas del mapa.
                 */
                updateMapLabels();

            }
        );

    });


    /* =====================================================
       CERRAR AL HACER CLIC FUERA
       ===================================================== */

    document.addEventListener(
        'click',
        function (event) {

            /*
             * Si el clic ocurrió dentro del contenedor
             * Explorar, no cerrar.
             */
            if (
                event.target.closest(
                    '.explore-wrapper'
                )
            ) {

                return;
            }


            /*
             * Si ocurrió fuera, cerrar.
             */
            closeExploreMenu();

        }
    );

}

/**
 * Abre el menú Explorar.
 */
function openExploreMenu() {

    const button =
        document.getElementById(
            'btn-explore'
        );


    const menu =
        document.getElementById(
            'explore-menu'
        );


    if (!button || !menu) {
        return;
    }


    button.classList.add('open');

    button.setAttribute(
        'aria-expanded',
        'true'
    );


    menu.classList.add('open');

    menu.setAttribute(
        'aria-hidden',
        'false'
    );
}


/**
 * Cierra el menú Explorar.
 *
 * IMPORTANTE:
 * No modifica activeExploreCategories.
 *
 * Por eso las burbujas seleccionadas
 * permanecen visibles.
 */
function closeExploreMenu() {

    const button =
        document.getElementById(
            'btn-explore'
        );


    const menu =
        document.getElementById(
            'explore-menu'
        );


    if (!button || !menu) {
        return;
    }


    button.classList.remove('open');

    button.setAttribute(
        'aria-expanded',
        'false'
    );


    menu.classList.remove('open');

    menu.setAttribute(
        'aria-hidden',
        'true'
    );
}























init();
setupExploreMenu();
animate();


//Inicializa la escena, la cámara, el renderizador y los controles de Three.js
//Inicializa la escena, la cámara, el renderizador y los controles de Three.js
function init() {

    loadDbMapData();


    /* =========================================================
       ESCENA
       ========================================================= */

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x807f7f);


    /* =========================================================
       CÁMARA
       ========================================================= */

    camera =
        new THREE.PerspectiveCamera(
            45,
            window.innerWidth /
            window.innerHeight,
            0.1,
            1000
        );


    camera.position.set(
        0,
        50,
        80
    );


    /* =========================================================
       RENDERIZADOR
       ========================================================= */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true
        });


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.setPixelRatio(
        window.devicePixelRatio
    );


    renderer.shadowMap.enabled =
        true;


    container.appendChild(
        renderer.domElement
    );


    /* =========================================================
       ILUMINACIÓN AMBIENTE
       ========================================================= */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            0.7
        );


    scene.add(
        ambientLight
    );


    /* =========================================================
       LUZ DIRECCIONAL
       ========================================================= */

    const sunLight =
        new THREE.DirectionalLight(
            0xffffff,
            1.0
        );


    sunLight.position.set(
        50,
        80,
        50
    );


    sunLight.castShadow =
        true;


    scene.add(
        sunLight
    );


    /* =========================================================
       ORBIT CONTROLS
       ========================================================= */

    controls =
        new THREE.OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.05;


    controls.screenSpacePanning =
        true;


    controls.minPolarAngle =
        0;


    controls.maxPolarAngle =
        Math.PI / 2.5 - 0.05;


    controls.minDistance =
        40;


    controls.maxDistance =
        250;


    controls.target.set(
        0,
        25,
        0
    );


    controls.update();


    /* =========================================================
       RAYCASTER
       ========================================================= */

    raycaster =
        new THREE.Raycaster();


    mouse =
        new THREE.Vector2();


    /* =========================================================
       CARGADOR GLTF
       ========================================================= */

    const loader =
        new THREE.GLTFLoader();


    /* =========================================================
       CARGAR MODELO GLB
       ========================================================= */

    loader.load(

        '/modelo/Mapa_UTTECAM.glb',


        function (gltf) {

            const model =
                gltf.scene;


            mapModel =
                model;


            scene.add(
                model
            );


            /* ---------------------------------------------
               Registrar objetos interactivos
               --------------------------------------------- */

            model.traverse(
                function (child) {

                    if (
                        child.isMesh
                    ) {

                        child.castShadow =
                            true;


                        child.receiveShadow =
                            true;


                        interactiveObjects.push(
                            child
                        );

                    }

                }
            );


            /* ---------------------------------------------
               Crear etiquetas
               --------------------------------------------- */

            buildMapLabels();


            /* ---------------------------------------------
               Restablecer cámara
               --------------------------------------------- */

            resetCameraView();


            /* ---------------------------------------------
               Ocultar pantalla de carga
               --------------------------------------------- */

            const loaderScreen =
                document.getElementById(
                    'loader'
                );


            if (
                loaderScreen
            ) {

                loaderScreen.style.opacity =
                    '0';


                setTimeout(
                    function () {

                        loaderScreen.style.display =
                            'none';

                    },
                    500
                );

            }

        },


        /* =====================================================
           PROGRESO DE CARGA
           ===================================================== */

        function (xhr) {

            if (
                xhr.total
            ) {

                console.log(
                    (
                        xhr.loaded /
                        xhr.total *
                        100
                    ) +
                    '% cargado'
                );

            }

        },


        /* =====================================================
           ERROR DE CARGA
           ===================================================== */

        function (error) {

            console.error(
                'Error al cargar la maqueta:',
                error
            );


            const loaderScreen =
                document.getElementById(
                    'loader'
                );


            if (
                loaderScreen
            ) {

                loaderScreen.innerHTML =
                    '<h2>Error al cargar Mapa_UTTECAM.glb</h2>' +
                    '<p>Asegúrate de que el archivo esté disponible en la ruta especificada</p>';

            }

        }

    );


    /* =========================================================
       EFFECT COMPOSER
       ========================================================= */

    composer =
        new THREE.EffectComposer(
            renderer
        );


    /* =========================================================
       RENDER PASS
       ========================================================= */

    const renderPass =
        new THREE.RenderPass(
            scene,
            camera
        );


    composer.addPass(
        renderPass
    );


    /* =========================================================
       OUTLINE PASS
       ========================================================= */

    outlinePass =
        new THREE.OutlinePass(
            new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            ),
            scene,
            camera
        );


    outlinePass.edgeStrength =
        5.0;


    outlinePass.edgeGlow =
        1.0;


    outlinePass.edgeThickness =
        2.0;


    outlinePass.visibleEdgeColor.set(
        '#4fd1c5'
    );


    outlinePass.hiddenEdgeColor.set(
        '#4fd1c5'
    );


    composer.addPass(
        outlinePass
    );


    /* =========================================================
       EVENTO RESIZE
       ========================================================= */

    window.addEventListener(
        'resize',
        onWindowResize
    );


    /* =========================================================
       MOVIMIENTO DEL MOUSE
       ========================================================= */

    window.addEventListener(
        'mousemove',
        onPointerMove
    );


    /* =========================================================
       POINTER DOWN
       ========================================================= */

    renderer.domElement.addEventListener(
        'pointerdown',
        onPointerDown
    );


    /* =========================================================
       TOUCH START
       ========================================================= */

    renderer.domElement.addEventListener(
        'touchstart',
        onPointerDown,
        {
            passive: true
        }
    );


    /* =========================================================
       POINTER UP
       ========================================================= */

    renderer.domElement.addEventListener(
        'pointerup',
        onPointerUp
    );


    /* =========================================================
       TOUCH END
       ========================================================= */

    renderer.domElement.addEventListener(
        'touchend',
        onPointerUp
    );


    /* =========================================================
       CLICK
       ========================================================= */

    renderer.domElement.addEventListener(
        'click',
        onPointerUp
    );


    /* =========================================================
       RUEDA DEL RATÓN
       ========================================================= */

    window.addEventListener(
        'wheel',
        onMouseWheel,
        {
            passive: true
        }
    );


    /* =========================================================
       BOTTOM SHEET
       ========================================================= */

    setupBottomSheetGestures();

}

// Obtiene y normaliza las coordenadas (NDC -1 a 1) para ratón o toque táctil
function updateMouseCoordinates(event) {
    let clientX = event.clientX;
    let clientY = event.clientY;

    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    }

    if (clientX !== undefined && clientY !== undefined) {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    }
}

// Registra la posición inicial y hora al presionar únicamente sobre el canvas 3D
function onPointerDown(event) {
    const isCanvasTarget = (renderer && renderer.domElement && (event.target === renderer.domElement || event.target.tagName === 'CANVAS'));
    if (!isCanvasTarget) {
        isPointerDownOnCanvas = false;
        return;
    }
    isPointerDownOnCanvas = true;

    let clientX = event.clientX;
    let clientY = event.clientY;
    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }
    touchStartX = clientX || 0;
    touchStartY = clientY || 0;
    touchStartTime = Date.now();
}

//Maneja el evento de movimiento del mouse para mostrar el tooltip y resaltar el objeto intersectado
function onPointerMove(event) {

    const elemento = event.target;

    if (
        elemento.closest(
            '.ui-button, ' +
            '.location-button, ' +
            '.explore-button, ' +
            '.explore-menu, ' +
            '.floating-details-card, ' +
            '.mascota, ' +
            '#mascota, ' +
            '#mascota-mensaje, ' +
            '.back-button-overlay'
        )
    ) {
        return;
    }

    if (event.pointerType === 'touch' || isTouchDevice) {
        if (hoveredObject) {
            hoveredObject = null;
            updateOutlines();
        }
        tooltip.classList.remove('visible');
        return;
    }

    // Ignorar trazado de rayos e interacciones 3D si el cursor está sobre elementos de interfaz flotantes
    if (event.target && event.target.closest('#details-card, .map-controls-overlay, .back-button-overlay')) {
        if (hoveredObject) {
            hoveredObject = null;
            updateOutlines();
        }
        if (tooltip) tooltip.classList.remove('visible');
        document.body.style.cursor = 'default';
        return;
    }

    updateMouseCoordinates(event);

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
        interactiveObjects
    );

    if (intersects.length > 0) {
        const object = intersects[0].object;
        const dbItem = findDbItemForMesh(object);

        if (dbItem) {
            const groupObj = getGroupObject(object);
            if (hoveredObject !== groupObj) {
                hoveredObject = groupObj;
                updateOutlines();
            }

            tooltip.textContent = dbItem.nombre;
            tooltip.style.left = `${event.clientX + 15}px`;
            tooltip.style.top = `${event.clientY + 15}px`;
            tooltip.classList.add('visible');
            document.body.style.cursor = 'pointer';
            return;
        }
    }

    if (hoveredObject) {
        hoveredObject = null;
        updateOutlines();
    }
    tooltip.classList.remove('visible');
    document.body.style.cursor = 'default';
}


//Ajusta la posición de la cámara para acercar la vista del mapa al hacer scroll
function onMouseWheel(event) {

    raycaster.setFromCamera(
        mouse,
        camera
    );


    const intersects = raycaster.intersectObjects(
        interactiveObjects
    );


    if (intersects.length > 0) {

        const intersectPoint =
            intersects[0].point;


        controls.target.lerp(
            intersectPoint,
            0.1
        );

    }

}


//Obtiene el objeto de grupo correspondiente al objeto intersectado, subiendo en la jerarquía 
//hasta encontrar un grupo con un nombre que comience con "Edificio_" o "Area_"
function getGroupObject(object) {

    let current = object;


    while (current.parent) {

        if (
            current.name.startsWith("Edificio_") ||
            current.name.startsWith("Zona_") ||
            current.name.startsWith("Area_") ||
            current.name.startsWith("Cancha_") ||
            current.name.startsWith("Presa_") ||
            current.name.startsWith("Biblioteca_") ||
            current.name.startsWith("Estacionamiento_") ||
            current.name.startsWith("Caseta_") ||
            current.name.startsWith("Almacen_") ||
            current.name.startsWith("Invernaderos_") ||
            current.name.startsWith("Huerta_") ||
            current.name.startsWith("Camino_") ||
            current.name.startsWith("Laboratorio_") ||
            current.name.startsWith("Cafeteria_") ||
            current.name.startsWith("Pasillos_")
        ) {

            return current;

        }


        current = current.parent;

    }


    return object;

}


//Maneja el evento de soltar la pantalla o clic (pointerup / touchend) en el canvas 3D
function onPointerUp(event) {

    if (!isPointerDownOnCanvas) {
        return;
    }
    isPointerDownOnCanvas = false;

    let clientX = event.clientX;
    let clientY = event.clientY;

    if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    } else if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }

    if (clientX === undefined || clientY === undefined) {
        return;
    }

    // Tolera hasta 25px de movimiento del dedo en móviles y 12px en PC, y hasta 600ms de duración
    if (touchStartTime > 0) {
        const deltaX = Math.abs(clientX - touchStartX);
        const deltaY = Math.abs(clientY - touchStartY);
        const deltaTime = Date.now() - touchStartTime;

        const maxDistance = isTouchDevice ? 25 : 12;
        const maxTime = 600;

        if (deltaX > maxDistance || deltaY > maxDistance || deltaTime > maxTime) {
            return;
        }
    }

    touchStartTime = 0;

    // Actualiza explícitamente el vector mouse con la posición actual del toque/clic
    updateMouseCoordinates(event);

    raycaster.setFromCamera(
        mouse,
        camera
    );


    const intersects =
        raycaster.intersectObjects(
            interactiveObjects
        );


    if (intersects.length > 0) {
        const object = intersects[0].object;
        const dbItem = findDbItemForMesh(object);

        if (dbItem) {
            const groupObj = getGroupObject(object);
            selectedObject = groupObj;
            updateOutlines();
            showDetails(dbItem.type, dbItem.data);
            return;
        }
    }

}



//Formatea el nombre del objeto para mostrarlo en la tarjeta de detalles y el tooltip
function formatName(name) {

    return name.replaceAll(
        '_',
        ' '
    );

}


//Obtiene los detalles del edificio o área verde desde la API y los muestra en la tarjeta de detalles
function fetchDetails(type, id, rawName) {


    const url =
        type === 'edificio'
            ? `/api/edificios/${id}`
            : `/api/areas-verdes/${id}`;



    fetch(url)

        .then(function (res) {

            if (!res.ok) {

                throw new Error(
                    'Sin detalles'
                );

            }


            return res.json();

        })


        .then(function (data) {

            showDetails(
                type,
                data
            );

        })


        .catch(function () {


            const title =
                formatName(rawName);


            const cardTitle =
                document.getElementById(
                    'card-title'
                );


            const cardBody =
                document.getElementById(
                    'card-body'
                );


            cardTitle.textContent =
                title;

            // TODO: Cambiar mensaje
            cardBody.innerHTML = `

            <div class="info-row">

                <div class="label">
                    Información
                </div>

                <div class="value">
                    Espacio seleccionado:
                    ${title}
                </div>

            </div>

        `;


            openDetailsCard();

        });

}

// Abre la tarjeta de detalles limpiando transformaciones táctiles anteriores
function openDetailsCard() {
    detailsCard.style.transform = '';
    detailsCard.style.transition = '';
    detailsCard.classList.add('visible');
}

// Cierra la tarjeta de detalles limpiando transformaciones táctiles e iluminación
function closeDetailsCard() {
    detailsCard.classList.remove('visible');
    detailsCard.style.transform = '';
    detailsCard.style.transition = '';
    selectedObject = null;
    updateOutlines();
}


let currentAreaVerdeData = null;

function openImageLightbox(src, alt) {
    const modal = document.getElementById('image-lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (!modal || !img) return;
    img.src = src;
    img.alt = alt || '';
    modal.classList.add('active');
}

function closeImageLightbox(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('image-lightbox-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageLightbox();
    }
});

function adjustHeroImgDimensions(img) {
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const diffRatio = (img.naturalWidth - img.naturalHeight) / img.naturalWidth;
    if (diffRatio > 0.4) {
        img.classList.add('contain-mode');
    } else {
        img.classList.remove('contain-mode');
    }
}

function setCardHero(assetId, altText) {
    const heroContainer = document.getElementById('card-hero-container');
    const detailsCard = document.getElementById('details-card');
    if (!heroContainer) return;
    if (assetId) {
        heroContainer.innerHTML = `<img src="/images/custom/${assetId}" class="card-hero-img" alt="${altText || ''}" title="Hacer clic para ampliar" onload="adjustHeroImgDimensions(this)" onclick="openImageLightbox(this.src, this.alt)">`;
        heroContainer.classList.add('visible');
        if (detailsCard) detailsCard.classList.add('has-hero');
        const img = heroContainer.querySelector('img');
        if (img && img.complete) {
            adjustHeroImgDimensions(img);
        }
    } else {
        heroContainer.innerHTML = '';
        heroContainer.classList.remove('visible');
        if (detailsCard) detailsCard.classList.remove('has-hero');
    }
}

//Muestra los detalles del edificio o área verde en la tarjeta de detalles
function showDetails(type, data) {
    const cardTitle = document.getElementById('card-title');
    const cardBody = document.getElementById('card-body');
    const backBtn = document.getElementById('card-back-btn');
    const detailsCard = document.getElementById('details-card');

    if (backBtn) backBtn.style.display = 'none';
    if (detailsCard) detailsCard.classList.remove('has-back-btn');

    setCardHero(data ? data.assetId : null, data ? data.nombre : '');

    if (type === 'edificio') {
        currentAreaVerdeData = null;
        cardTitle.textContent = data.nombre;
        cardBody.innerHTML = `
            <div class="info-row">
                <div class="label">Carreras / Uso</div>
                <div class="value">${data.carreras || 'General'}</div>
            </div>
        `;
    } else {
        currentAreaVerdeData = data;
        cardTitle.textContent = data.nombre || 'Área Verde';

        let speciesHtml = '';
        const speciesList = data.especies ? (Array.isArray(data.especies) ? data.especies : Object.values(data.especies)) : [];

        if (speciesList.length > 0) {
            speciesHtml = '<div class="map-species-container">';
            speciesList.forEach(esp => {
                const reinoClass = esp.reino ? 'reino-' + esp.reino.toLowerCase() : '';
                speciesHtml += `
                    <div class="map-species-tag ${reinoClass}" onclick="showSpeciesDetails(${esp.id})" title="Ver ficha técnica de ${esp.nombre}">
                        <span class="map-species-dot"></span>
                        <span>${esp.nombre}</span>
                    </div>
                `;
            });
            speciesHtml += '</div>';
        } else {
            speciesHtml = '<div class="value" style="color: #718096; font-size: 13px; font-style: italic;">Sin especies registradas en esta área.</div>';
        }

        cardBody.innerHTML = `
            <div class="info-row">
                <div class="label">Ubicación / Sector</div>
                <div class="value">${data.sector || 'Campus General'}</div>
            </div>

            <div class="info-row">
                <div class="label">Superficie</div>
                <div class="value">${data.superficie ? data.superficie + ' m²' : 'No especificada'}</div>
            </div>

            <div class="info-row">
                <div class="label">Descripción</div>
                <div class="value">${data.descripcion || 'Área verde del campus'}</div>
            </div>

            <div class="info-row" style="margin-top: 16px;">
                <div class="label">Especies Residentes (${speciesList.length})</div>
                ${speciesHtml}
            </div>
        `;
    }

    openDetailsCard();
}

function transitionCardContent(updateCallback) {
    const cardBody = document.getElementById('card-body');
    const cardTitle = document.getElementById('card-title');

    if (!cardBody) {
        updateCallback();
        return;
    }

    cardBody.classList.add('content-fading');
    if (cardTitle) cardTitle.classList.add('title-fading');

    setTimeout(() => {
        updateCallback();

        requestAnimationFrame(() => {
            cardBody.classList.remove('content-fading');
            if (cardTitle) cardTitle.classList.remove('title-fading');
        });
    }, 160);
}

function showSpeciesDetails(especieId) {
    if (!currentAreaVerdeData || !currentAreaVerdeData.especies) return;

    const speciesList = Array.isArray(currentAreaVerdeData.especies)
        ? currentAreaVerdeData.especies
        : Object.values(currentAreaVerdeData.especies);

    const especie = speciesList.find(e => e.id == especieId);
    if (!especie) return;

    transitionCardContent(() => {
        const cardTitle = document.getElementById('card-title');
        const cardBody = document.getElementById('card-body');
        const backBtn = document.getElementById('card-back-btn');
        const detailsCard = document.getElementById('details-card');

        if (backBtn) backBtn.style.display = 'inline-flex';
        if (detailsCard) detailsCard.classList.add('has-back-btn');
        if (cardTitle) cardTitle.textContent = especie.nombre;

        setCardHero(especie.assetId, especie.nombre);

        const reinoClass = especie.reino ? 'reino-' + especie.reino.toLowerCase() : '';

        cardBody.innerHTML = `
            <div class="info-row" style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <div class="label">Nombre Común</div>
                    <div class="value" style="font-size: 16px; color: #1a202c;">${especie.nombre}</div>
                </div>
                <span class="map-species-tag ${reinoClass}" style="cursor: default;">
                    <span class="map-species-dot"></span>
                    <span>${especie.reino || 'Plantae'}</span>
                </span>
            </div>

            <div class="info-row" style="margin-top: 12px;">
                <div class="label">Taxonomía</div>
                <div class="taxonomy-grid">
                    <div class="taxonomy-item">
                        <span class="tax-label">Phylum / Div.</span>
                        <span class="tax-val">${especie.divisionPhylum || '-'}</span>
                    </div>
                    <div class="taxonomy-item">
                        <span class="tax-label">Clase</span>
                        <span class="tax-val">${especie.clase || '-'}</span>
                    </div>
                    <div class="taxonomy-item">
                        <span class="tax-label">Orden</span>
                        <span class="tax-val">${especie.orden || '-'}</span>
                    </div>
                    <div class="taxonomy-item">
                        <span class="tax-label">Familia</span>
                        <span class="tax-val">${especie.familia || '-'}</span>
                    </div>
                    <div class="taxonomy-item">
                        <span class="tax-label">Género</span>
                        <span class="tax-val">${especie.genero || '-'}</span>
                    </div>
                    <div class="taxonomy-item">
                        <span class="tax-label">Especie</span>
                        <span class="tax-val">${especie.especie || '-'}</span>
                    </div>
                </div>
            </div>

            <div class="info-row" style="margin-top: 12px;">
                <div class="label">Observaciones / Notas</div>
                <div class="value" style="font-size: 13px; font-weight: 500; color: #4a5568; line-height: 1.5;">
                    ${especie.observaciones || 'Sin observaciones registradas.'}
                </div>
            </div>
        `;
    });
}

function goBackToAreaCard() {
    if (currentAreaVerdeData) {
        transitionCardContent(() => {
            showDetails('area-verde', currentAreaVerdeData);
        });
    }
}


// Configura los gestos táctiles para deslizar (jalar/arrastrar) el Bottom Sheet en móviles
function setupBottomSheetGestures() {
    if (!detailsCard) return;

    let startY = 0;
    let currentDeltaY = 0;
    let isDragging = false;

    function onDragStart(clientY) {
        if (window.innerWidth > 768 || !detailsCard.classList.contains('visible')) return;
        startY = clientY;
        currentDeltaY = 0;
        isDragging = true;
        detailsCard.style.transition = 'none';
    }

    function onDragMove(clientY) {
        if (!isDragging || window.innerWidth > 768) return;
        const diffY = clientY - startY;

        if (diffY > 0) {
            // Deslizar hacia abajo (hacia cerrar)
            currentDeltaY = diffY;
            detailsCard.style.transform = `translateY(${currentDeltaY}px)`;
        } else {
            // Permite alargar/deslizar suavemente hacia arriba (hasta -150px) con resistencia progresiva
            const maxPullUp = 150;
            currentDeltaY = Math.max(-maxPullUp, diffY * 0.45);
            detailsCard.style.transform = `translateY(${currentDeltaY}px)`;
        }
    }

    function onDragEnd() {
        if (!isDragging || window.innerWidth > 768) return;
        isDragging = false;
        detailsCard.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';

        if (currentDeltaY > 80) {
            closeDetailsCard();
        } else {
            detailsCard.style.transform = 'translateY(0)';
        }
    }

    // Eventos táctiles (Smartphones)
    detailsCard.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches.length === 1) {
            onDragStart(e.touches[0].clientY);
        }
    }, { passive: true });

    detailsCard.addEventListener('touchmove', function (e) {
        if (e.touches && e.touches.length === 1) {
            onDragMove(e.touches[0].clientY);
        }
    }, { passive: true });

    detailsCard.addEventListener('touchend', function () {
        onDragEnd();
    });

    // Eventos de puntero para simular arrastre en navegador/PC DevTools
    detailsCard.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        onDragStart(e.clientY);
    });

    window.addEventListener('pointermove', function (e) {
        if (isDragging) {
            onDragMove(e.clientY);
        }
    });

    window.addEventListener('pointerup', function () {
        if (isDragging) {
            onDragEnd();
        }
    });
}

//Ajusta la cámara y el renderizador al cambiar el tamaño de la ventana
function onWindowResize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    composer.setSize(
        window.innerWidth,
        window.innerHeight
    );

}


//Animación de la escena
function animate() {

    requestAnimationFrame(
        animate
    );

    controls.update();

    /*
     * Mantiene las burbujas sincronizadas
     * con la cámara y el mapa.
     */
    updateMapLabels();

    if (typeof updateCompass === 'function') {
        updateCompass();
    }

    composer.render();

}




//Ajusta la posición de la cámara para mostrar toda la maqueta en la vista
function resetCameraView() {

    const box =
        new THREE.Box3();


    interactiveObjects.forEach(function (obj) {

        box.expandByObject(
            obj
        );

    });



    const center =
        box.getCenter(
            new THREE.Vector3()
        );


    const size =
        box.getSize(
            new THREE.Vector3()
        );


    const maxDim =
        Math.max(
            size.x,
            size.y,
            size.z
        );



    controls.target.copy(
        center
    );


    controls.target.set(
        center.x,
        center.y - (maxDim * 0.15),
        center.z
    );



    camera.position.set(

        center.x + maxDim * 0.3,

        center.y + maxDim * 0.4,

        center.z + maxDim * 0.7

    );



    controls.update();



    if (hoveredObject || selectedObject) {

        hoveredObject = null;
        selectedObject = null;

        updateOutlines();

    }

}











/*
  Autor: Cristobal Torres Ramos
  Ano: 2026
  Version: 1.2
  Descripcion: Ajuste de la posicion inicial de la camara en Three.js para mostrar la maqueta desde la perspectiva opuesta.
*/

function norteCameraView() {

    const box = new THREE.Box3();

    // Calcula la caja delimitadora que envuelve todos los objetos interactivos
    interactiveObjects.forEach(function (obj) {
        box.expandByObject(obj);
    });

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Configura el punto hacia donde mira la camara (el centro del mapa)
    controls.target.copy(center);
    controls.target.set(
        center.x,
        center.y - (maxDim * 0.15),
        center.z
    );

    // MODIFICACION: Se cambian los signos de X y Z a negativos.
    // Esto mueve la camara al lado contrario del mapa para coincidir con la nueva vista.
    camera.position.set(

        center.x + maxDim * 0.8,

        center.y + maxDim * 0.4,

        center.z

    );

    controls.update();

    // Reinicia los estados visuales si habia un objeto seleccionado
    if (hoveredObject || selectedObject) {
        hoveredObject = null;
        selectedObject = null;
        updateOutlines();
    }
}































//Ajusta la posición de la cámara para acercar la vista del mapa
function zoomIn() {

    onMouseWheel({ deltaY: 0 });

    const direction = new THREE.Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();

    const distance = camera.position.distanceTo(controls.target);

    let newDistance = distance * 0.8; // Acerca un 20%

    newDistance = Math.max(newDistance, controls.minDistance);

    camera.position.copy(
        controls.target.clone().add(
            direction.multiplyScalar(newDistance)
        )
    );

    controls.update();
}



//Ajusta la posición de la cámara para alejar la vista del mapa
function zoomOut() {

    const direction = new THREE.Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();

    const distance = camera.position.distanceTo(controls.target);

    let newDistance = distance * 1.2; // Aleja un 20%

    newDistance = Math.min(newDistance, controls.maxDistance);

    camera.position.copy(
        controls.target.clone().add(
            direction.multiplyScalar(newDistance)
        )
    );

    controls.update();
}






/*
    Exponer funciones para los botones HTML
    con onclick="" cuando el JS está separado
*/

window.resetCameraView =
    resetCameraView;


window.zoomIn =
    zoomIn;


window.zoomOut =
    zoomOut;


window.closeDetailsCard =
    closeDetailsCard;

window.showSpeciesDetails =
    showSpeciesDetails;

window.goBackToAreaCard =
    goBackToAreaCard;






































/* =========================================================
   CONSTRUIR ETIQUETAS DEL MAPA
   ========================================================= */

function buildMapLabels() {

    if (!mapModel) {

        console.warn(
            'No existe mapModel para crear etiquetas.'
        );

        return;
    }


    const layer =
        createMapLabelLayer();


    /* ---------------------------------------------
       Limpiar etiquetas anteriores
       --------------------------------------------- */

    mapLabels.forEach(label => {

        if (
            label.element &&
            label.element.parentNode
        ) {

            label.element.remove();
        }

    });


    mapLabels = [];


    /* ---------------------------------------------
       Evitar duplicados
       --------------------------------------------- */

    const processedObjects =
        new Set();


    /* ---------------------------------------------
       Recorrer Mesh
       --------------------------------------------- */

    interactiveObjects.forEach(mesh => {

        const groupObject =
            getGroupObject(mesh);


        if (!groupObject) {
            return;
        }


        if (
            processedObjects.has(
                groupObject
            )
        ) {

            return;
        }


        processedObjects.add(
            groupObject
        );


        /* -----------------------------------------
           Buscar información BD
           ----------------------------------------- */

        const dbItem =
            findDbItemForMesh(mesh);


        /* -----------------------------------------
           Crear etiqueta
           ----------------------------------------- */

        createMapLabel(
            groupObject,
            dbItem
        );

    });


    console.log(
        'Etiquetas creadas:',
        mapLabels.length
    );


    updateMapLabels();
}


/* =========================================================
   ACTUALIZAR ETIQUETAS DEL MAPA
   ========================================================= */

function updateMapLabels() {

    if (
        !camera ||
        !renderer ||
        !mapLabels ||
        mapLabels.length === 0
    ) {
        return;
    }


    const width =
        renderer.domElement.clientWidth;

    const height =
        renderer.domElement.clientHeight;


    mapLabels.forEach(label => {

        if (
            !label.object ||
            !label.element
        ) {
            return;
        }


        /* ---------------------------------------------
           Obtener posición del objeto
           --------------------------------------------- */

        const worldPosition =
            getLabelWorldPosition(
                label.object
            );


        label.position.copy(
            worldPosition
        );


        /* ---------------------------------------------
           Convertir posición 3D → pantalla
           --------------------------------------------- */

        const projected =
            worldPosition.clone();


        projected.project(camera);


        /* ---------------------------------------------
           Comprobar si el objeto está delante
           de la cámara.
           
           IMPORTANTE:
           El valor correcto es Z <= 1.
           --------------------------------------------- */

        if (
            projected.z < -1 ||
            projected.z > 1
        ) {

            label.element.classList.remove(
                'visible'
            );

            return;
        }


        /* ---------------------------------------------
           Coordenadas de pantalla
           --------------------------------------------- */

        const x =
            (projected.x * 0.5 + 0.5)
            * width;


        const y =
            (-projected.y * 0.5 + 0.5)
            * height;


        /* ---------------------------------------------
           Comprobar si está fuera de pantalla
           --------------------------------------------- */

        const margin = 100;


        if (
            x < -margin ||
            x > width + margin ||
            y < -margin ||
            y > height + margin
        ) {

            label.element.classList.remove(
                'visible'
            );

            return;
        }


        /* ---------------------------------------------
           Posicionar etiqueta
           --------------------------------------------- */

        label.element.style.left =
            `${x}px`;


        label.element.style.top =
            `${y}px`;


        /* ---------------------------------------------
           Entradas:
           SIEMPRE visibles
           --------------------------------------------- */

        if (
            label.category === 'entradas'
        ) {

            label.element.classList.add(
                'visible'
            );

            return;
        }


        /* ---------------------------------------------
           Otras categorías
           --------------------------------------------- */

        if (
            activeExploreCategories.has(
                label.category
            )
        ) {

            label.element.classList.add(
                'visible'
            );

        } else {

            label.element.classList.remove(
                'visible'
            );
        }

    });
}


/* =========================================================
   MENÚ EXPLORAR
   ========================================================= */

function setupExploreMenu() {

    const exploreButton = document.getElementById('btn-explore');
    const exploreMenu = document.getElementById('explore-menu');

    if (!exploreButton || !exploreMenu) {
        console.warn('No se encontró el botón o menú Explorar.');
        return;
    }

    console.log('Menú Explorar inicializado correctamente.');

    /* Abrir / cerrar menú */
    exploreButton.addEventListener('click', function (event) {

        event.preventDefault();
        event.stopPropagation();

        const abierto = exploreMenu.classList.contains('open');

        if (abierto) {

            exploreMenu.classList.remove('open');
            exploreButton.classList.remove('open');

            exploreButton.setAttribute(
                'aria-expanded',
                'false'
            );

            exploreMenu.setAttribute(
                'aria-hidden',
                'true'
            );

        } else {

            exploreMenu.classList.add('open');
            exploreButton.classList.add('open');

            exploreButton.setAttribute(
                'aria-expanded',
                'true'
            );

            exploreMenu.setAttribute(
                'aria-hidden',
                'false'
            );
        }
    });


    /* Evitar que el menú se cierre al pulsar dentro */
    exploreMenu.addEventListener('click', function (event) {
        event.stopPropagation();
    });


    /* Selección de categorías */
    const options = document.querySelectorAll('.explore-option');

    options.forEach(function (option) {

        option.addEventListener('click', function () {

            const category = option.dataset.category;

            if (!category) {
                return;
            }

            if (activeExploreCategories.has(category)) {

                activeExploreCategories.delete(category);

                option.classList.remove('active');

            } else {

                activeExploreCategories.add(category);

                option.classList.add('active');
            }

            /*
             * Actualizar etiquetas si la función existe.
             */
            if (typeof updateMapLabels === 'function') {
                updateMapLabels();
            }
        });
    });


    /* Cerrar solamente al hacer clic fuera */
    document.addEventListener('click', function (event) {

        if (!event.target.closest('.explore-wrapper')) {

            exploreMenu.classList.remove('open');
            exploreButton.classList.remove('open');

            exploreButton.setAttribute(
                'aria-expanded',
                'false'
            );

            exploreMenu.setAttribute(
                'aria-hidden',
                'true'
            );
        }
    });
}


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        setupExploreMenu();

        setupMapSearch();

    }
);





































































/* =========================================================
   SISTEMA DE BÚSQUEDA DEL MAPA
   ========================================================= */

/**
 * Configura el buscador general del mapa.
 *
 * Permite buscar:
 *
 * - Edificios
 * - Áreas verdes
 * - Canchas
 *
 * La búsqueda de edificios y áreas verdes se realiza
 * mediante la API de Spring Boot.
 *
 * Las canchas se localizan directamente dentro
 * del modelo 3D mediante el nombre del objeto.
 *
 * @author Cristobal Torres Ramos
 * @version 1.3
 */
function setupMapSearch() {

    const searchInput =
        document.getElementById(
            'map-search-input'
        );

    const searchResults =
        document.getElementById(
            'map-search-results'
        );

    const clearButton =
        document.getElementById(
            'map-search-clear'
        );


    if (
        !searchInput ||
        !searchResults ||
        !clearButton
    ) {

        console.warn(
            'No se encontraron los elementos del buscador.'
        );

        return;
    }


    let searchTimeout = null;


    /* =====================================================
       ESCRIBIR EN EL BUSCADOR
       ===================================================== */

    searchInput.addEventListener(
        'input',
        function () {

            const texto =
                searchInput.value.trim();


            clearButton.style.display =
                texto.length > 0
                    ? 'flex'
                    : 'none';


            clearTimeout(
                searchTimeout
            );


            if (!texto) {

                closeSearchResults();

                return;
            }


            /*
             * Esperar un momento antes de buscar.
             *
             * Esto evita realizar una petición
             * por cada letra escrita.
             */
            searchTimeout =
                setTimeout(
                    function () {

                        searchCampus(
                            texto
                        );

                    },
                    250
                );

        }
    );


    /* =====================================================
       BOTÓN LIMPIAR
       ===================================================== */

    clearButton.addEventListener(
        'click',
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            searchInput.value = '';

            clearButton.style.display =
                'none';

            closeSearchResults();

            searchInput.focus();

        }
    );


    /* =====================================================
       EVITAR INTERACCIÓN CON EL MAPA 3D
       ===================================================== */

    const searchContainer =
        document.getElementById(
            'map-search-container'
        );


    if (searchContainer) {

        searchContainer.addEventListener(
            'pointerdown',
            function (event) {

                event.stopPropagation();

            }
        );


        searchContainer.addEventListener(
            'click',
            function (event) {

                event.stopPropagation();

            }
        );

    }


    /* =====================================================
       CERRAR RESULTADOS AL HACER CLIC FUERA
       ===================================================== */

    document.addEventListener(
        'click',
        function (event) {

            if (
                !event.target.closest(
                    '#map-search-container'
                )
            ) {

                closeSearchResults();

            }

        }
    );
}


/* =========================================================
   BÚSQUEDA GENERAL DEL CAMPUS
   ========================================================= */

/**
 * Busca cualquier elemento disponible en la base de datos.
 *
 * La búsqueda utiliza un único endpoint general:
 *
 *      /api/map-data
 *
 * Esto permite buscar sin limitarse a una lista fija
 * de categorías.
 *
 * También se buscan elementos que existan directamente
 * en el modelo 3D.
 *
 * @param {string} texto Texto introducido por el usuario.
 *
 * @author Cristobal Torres Ramos
 * @version 1.4
 */
async function searchCampus(texto) {

    const searchResults =
        document.getElementById(
            'map-search-results'
        );


    if (!searchResults) {
        return;
    }


    const textoBusqueda =
        normalizeSearchText(
            texto
        );


    if (!textoBusqueda) {

        closeSearchResults();

        return;
    }


    /*
     * Mostrar estado de búsqueda.
     */
    searchResults.innerHTML = `
        <div class="map-search-empty">
            Buscando...
        </div>
    `;


    searchResults.classList.add(
        'visible'
    );


    try {

        /*
         * =====================================================
         * OBTENER TODOS LOS DATOS DE LA BASE DE DATOS
         * =====================================================
         *
         * El endpoint debe devolver todas las categorías
         * disponibles en la base de datos.
         */
        const response =
            await fetch(
                '/api/map-data'
            );


        if (!response.ok) {

            throw new Error(
                'No se pudieron obtener los datos del campus.'
            );

        }


        const mapData =
            await response.json();


        const resultados = [];


        /*
         * =====================================================
         * RECORRER TODAS LAS CATEGORÍAS
         * =====================================================
         *
         * No se utiliza una lista cerrada de tipos.
         *
         * Cualquier propiedad del JSON que contenga
         * un arreglo será considerada como una categoría.
         */
        Object.keys(
            mapData
        ).forEach(
            function (categoria) {

                const elementos =
                    mapData[
                    categoria
                    ];


                /*
                 * Ignorar propiedades que no sean arreglos.
                 */
                if (
                    !Array.isArray(
                        elementos
                    )
                ) {

                    return;

                }


                elementos.forEach(
                    function (elemento) {

                        if (!elemento) {
                            return;
                        }


                        /*
                         * Construir un texto con TODOS
                         * los datos del registro.
                         *
                         * Esto permite encontrar un elemento
                         * aunque la coincidencia esté en otro
                         * campo distinto a "nombre".
                         */
                        const textoRegistro =
                            Object.keys(
                                elemento
                            )
                                .map(
                                    function (campo) {

                                        const valor =
                                            elemento[
                                            campo
                                            ];


                                        if (
                                            valor === null ||
                                            valor === undefined
                                        ) {

                                            return '';

                                        }


                                        return String(
                                            valor
                                        );

                                    }
                                )
                                .join(' ');


                        const textoNormalizado =
                            normalizeSearchText(
                                textoRegistro
                            );


                        /*
                         * =================================================
                         * COINCIDENCIA
                         * =================================================
                         *
                         * Solamente mostrar registros relacionados
                         * con lo que escribió el usuario.
                         */
                        if (
                            !textoNormalizado.includes(
                                textoBusqueda
                            )
                        ) {

                            return;

                        }


                        /*
                         * Determinar el tipo a partir
                         * del nombre de la categoría.
                         */
                        const tipo =
                            obtenerTipoResultado(
                                categoria
                            );


                        resultados.push({

                            type:
                                tipo,

                            categoria:
                                categoria,

                            data:
                                elemento,

                            nombre:
                                obtenerNombreResultado(
                                    elemento
                                )

                        });

                    }
                );

            }
        );


        /*
         * =====================================================
         * BUSCAR TAMBIÉN EN EL MODELO 3D
         * =====================================================
         *
         * Esto mantiene funcionando la búsqueda de canchas
         * y cualquier otro objeto que todavía no tenga
         * una tabla en la base de datos.
         */
        const objetos3D =
            searchObjectsInModel(
                textoBusqueda
            );


        objetos3D.forEach(
            function (objeto) {

                /*
                 * Evitar duplicados si posteriormente
                 * el objeto también existe en la BD.
                 */
                const existe =
                    resultados.some(
                        function (resultado) {

                            return (
                                resultado.data &&
                                resultado.data.object ===
                                objeto.object
                            );

                        }
                    );


                if (!existe) {

                    resultados.push({

                        type:
                            objeto.type,

                        categoria:
                            'modelo3D',

                        data:
                            objeto,

                        nombre:
                            objeto.nombre

                    });

                }

            }
        );


        /*
         * =====================================================
         * ELIMINAR DUPLICADOS
         * =====================================================
         */
        const resultadosUnicos =
            eliminarResultadosDuplicados(
                resultados
            );


        /*
         * =====================================================
         * MOSTRAR RESULTADOS
         * =====================================================
         */
        renderSearchResults(
            resultadosUnicos
        );


    } catch (error) {

        console.error(
            'Error general en la búsqueda:',
            error
        );


        searchResults.innerHTML = `
            <div class="map-search-empty">
                No se pudo realizar la búsqueda.
            </div>
        `;

    }

}

/* =========================================================
   OBTENER NOMBRE DEL RESULTADO
   ========================================================= */

/**
 * Obtiene el nombre visible de un registro.
 *
 * Se prueban diferentes campos comunes para que el
 * buscador no dependa exclusivamente de "nombre".
 *
 * @param {Object} elemento Registro de la BD.
 * @return {string} Nombre para mostrar.
 */
function obtenerNombreResultado(elemento) {

    if (!elemento) {
        return 'Elemento del campus';
    }


    const posiblesNombres = [

        elemento.nombre,

        elemento.nombreLugar,

        elemento.nombreArea,

        elemento.descripcion,

        elemento.titulo,

        elemento.nombreEdificio,

        elemento.nombreEstacionamiento,

        elemento.nombrePresa,

        elemento.nombreInvernadero,

        elemento.nombreHuerta

    ];


    for (
        let i = 0;
        i < posiblesNombres.length;
        i++
    ) {

        if (
            posiblesNombres[i] !== null &&
            posiblesNombres[i] !== undefined &&
            String(
                posiblesNombres[i]
            ).trim() !== ''
        ) {

            return String(
                posiblesNombres[i]
            );

        }

    }


    return 'Elemento del campus';

}


/* =========================================================
   DETERMINAR TIPO DE RESULTADO
   ========================================================= */

/**
 * Convierte el nombre de la propiedad JSON
 * en un tipo entendible para la interfaz.
 *
 * @param {string} categoria Categoría del JSON.
 * @return {string} Tipo del resultado.
 */
function obtenerTipoResultado(categoria) {

    const categoriaNormalizada =
        normalizeSearchText(
            categoria
        );


    if (
        categoriaNormalizada.includes(
            'edificio'
        )
    ) {

        return 'edificio';

    }


    if (
        categoriaNormalizada.includes(
            'area'
        ) ||
        categoriaNormalizada.includes(
            'zona'
        )
    ) {

        return 'area-verde';

    }


    if (
        categoriaNormalizada.includes(
            'estacionamiento'
        )
    ) {

        return 'estacionamiento';

    }


    if (
        categoriaNormalizada.includes(
            'presa'
        )
    ) {

        return 'presa';

    }


    if (
        categoriaNormalizada.includes(
            'invernadero'
        )
    ) {

        return 'invernadero';

    }


    if (
        categoriaNormalizada.includes(
            'huerta'
        )
    ) {

        return 'huerta';

    }


    if (
        categoriaNormalizada.includes(
            'cancha'
        )
    ) {

        return 'cancha';

    }


    /*
     * Si aparece una categoría nueva que todavía
     * no hemos contemplado, NO se descarta.
     */
    return 'otro';

}


/* =========================================================
   BUSCAR OBJETOS EN EL MODELO 3D
   ========================================================= */

/**
 * Busca objetos directamente en el modelo 3D.
 *
 * @param {string} texto Texto normalizado.
 * @return {Array} Objetos encontrados.
 */
function searchObjectsInModel(texto) {

    const resultados = [];


    if (
        !interactiveObjects ||
        interactiveObjects.length === 0
    ) {

        return resultados;

    }


    const procesados =
        new Set();


    interactiveObjects.forEach(
        function (mesh) {

            const groupObject =
                getGroupObject(
                    mesh
                );


            if (!groupObject) {
                return;
            }


            if (
                procesados.has(
                    groupObject
                )
            ) {

                return;

            }


            procesados.add(
                groupObject
            );


            /*
             * Obtener todos los nombres de la
             * jerarquía del objeto.
             */
            const nombres = [];


            let current =
                groupObject;


            while (
                current &&
                current !== scene
            ) {

                if (
                    current.name
                ) {

                    nombres.push(
                        current.name
                    );

                }


                current =
                    current.parent;

            }


            const nombreCompleto =
                nombres.join(' ');


            const nombreNormalizado =
                normalizeSearchText(
                    nombreCompleto
                );


            /*
             * Buscar coincidencia.
             */
            if (
                !nombreNormalizado.includes(
                    texto
                )
            ) {

                return;

            }


            /*
             * Determinar tipo.
             */
            let tipo =
                'otro';


            if (
                nombreNormalizado.includes(
                    'cancha'
                ) ||
                nombreNormalizado.includes(
                    'campo'
                )
            ) {

                tipo =
                    'cancha';

            } else if (
                nombreNormalizado.includes(
                    'estacionamiento'
                )
            ) {

                tipo =
                    'estacionamiento';

            } else if (
                nombreNormalizado.includes(
                    'presa'
                )
            ) {

                tipo =
                    'presa';

            } else if (
                nombreNormalizado.includes(
                    'invernadero'
                )
            ) {

                tipo =
                    'invernadero';

            } else if (
                nombreNormalizado.includes(
                    'huerta'
                )
            ) {

                tipo =
                    'huerta';

            } else if (
                nombreNormalizado.includes(
                    'area'
                ) ||
                nombreNormalizado.includes(
                    'zona verde'
                )
            ) {

                tipo =
                    'area-verde';

            }


            resultados.push({

                type:
                    tipo,

                nombre:
                    formatName(
                        groupObject.name
                    ),

                codigoMesh:
                    groupObject.name,

                object:
                    groupObject

            });

        }
    );


    return resultados;

}


/* =========================================================
   ELIMINAR RESULTADOS DUPLICADOS
   ========================================================= */

/**
 * Elimina registros repetidos de la búsqueda.
 *
 * @param {Array} resultados Resultados originales.
 * @return {Array} Resultados únicos.
 */
function eliminarResultadosDuplicados(
    resultados
) {

    const vistos =
        new Set();


    return resultados.filter(
        function (resultado) {

            const elemento =
                resultado.data;


            if (!elemento) {
                return true;
            }


            const id =
                elemento.id !== undefined
                    ? String(
                        elemento.id
                    )
                    : '';


            const codigo =
                elemento.codigoMesh
                    ? normalizeSearchText(
                        elemento.codigoMesh
                    )
                    : '';


            const nombre =
                normalizeSearchText(
                    resultado.nombre ||
                    ''
                );


            const clave =
                resultado.type +
                '|' +
                id +
                '|' +
                codigo +
                '|' +
                nombre;


            if (
                vistos.has(
                    clave
                )
            ) {

                return false;

            }


            vistos.add(
                clave
            );


            return true;

        }
    );

}

/* =========================================================
   BUSCAR CANCHAS EN EL MODELO 3D
   ========================================================= */

/**
 * Busca canchas directamente dentro del modelo GLB.
 *
 * Esto permite localizar canchas aunque todavía
 * no exista una tabla específica para ellas en la BD.
 *
 * @param {string} texto Texto de búsqueda.
 * @return {Array} Canchas encontradas.
 */
function searchCourtsInModel(texto) {

    const resultados = [];


    if (
        !mapModel ||
        !interactiveObjects ||
        interactiveObjects.length === 0
    ) {

        return resultados;

    }


    const textoNormalizado =
        normalizeSearchText(
            texto
        );


    const procesados =
        new Set();


    interactiveObjects.forEach(function (mesh) {

        const groupObject =
            getGroupObject(
                mesh
            );


        if (!groupObject) {
            return;
        }


        if (
            procesados.has(
                groupObject
            )
        ) {

            return;

        }


        procesados.add(
            groupObject
        );


        const nombres = [];


        let current =
            groupObject;


        while (
            current &&
            current !== scene
        ) {

            if (current.name) {

                nombres.push(
                    current.name
                );

            }


            current =
                current.parent;

        }


        const nombreCompleto =
            nombres.join(' ');


        const nombreNormalizado =
            normalizeSearchText(
                nombreCompleto
            );


        /*
         * Solamente considerar objetos
         * relacionados con canchas.
         */
        const esCancha =
            nombreNormalizado.includes(
                'cancha'
            ) ||
            nombreNormalizado.includes(
                'campo'
            );


        if (!esCancha) {
            return;
        }


        /*
         * Comprobar si coincide con
         * el texto buscado.
         */
        if (
            !nombreNormalizado.includes(
                textoNormalizado
            )
        ) {

            return;

        }


        resultados.push({

            nombre:
                formatName(
                    groupObject.name
                ),

            codigoMesh:
                groupObject.name,

            object:
                groupObject

        });

    });


    return resultados;
}


/* =========================================================
   NORMALIZAR TEXTO DE BÚSQUEDA
   ========================================================= */

/**
 * Normaliza texto para facilitar las búsquedas.
 *
 * @param {string} texto Texto original.
 * @return {string} Texto normalizado.
 */
function normalizeSearchText(texto) {

    if (!texto) {
        return '';
    }


    return texto
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[_\-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}


/* =========================================================
   MOSTRAR RESULTADOS
   ========================================================= */

/**
 * Muestra únicamente los nombres de los resultados
 * que coinciden con la búsqueda.
 *
 * No muestra información adicional como:
 *
 * - Carreras
 * - Sector
 * - Tipo de objeto
 *
 * Esto mantiene el buscador limpio y fácil de leer.
 *
 * @param {Array} resultados Resultados encontrados.
 */
function renderSearchResults(resultados) {

    const searchResults =
        document.getElementById(
            'map-search-results'
        );


    if (!searchResults) {
        return;
    }


    /*
     * Limpiar resultados anteriores.
     */
    searchResults.innerHTML = '';


    /*
     * Si no existen resultados,
     * mostrar únicamente el mensaje correspondiente.
     */
    if (
        !resultados ||
        resultados.length === 0
    ) {

        searchResults.innerHTML = `
            <div class="map-search-empty">
                No se encontraron resultados.
            </div>
        `;

        searchResults.classList.add(
            'visible'
        );

        return;
    }


    /*
     * Crear un resultado por cada coincidencia.
     */
    resultados.forEach(function (resultado) {

        /*
         * Crear botón del resultado.
         */
        const result =
            document.createElement(
                'button'
            );


        result.type =
            'button';


        result.className =
            'map-search-result';


        /*
         * =================================================
         * NOMBRE DEL RESULTADO
         * =================================================
         *
         * Este será el único texto que aparecerá
         * debajo del buscador.
         */
        const nombre =
            document.createElement(
                'span'
            );


        nombre.className =
            'map-search-result-name';


        nombre.textContent =
            resultado.nombre;


        /*
         * Agregar solamente el nombre.
         */
        result.appendChild(
            nombre
        );


        /*
         * =================================================
         * SELECCIONAR RESULTADO
         * =================================================
         */
        result.addEventListener(
            'click',
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                selectSearchResult(
                    resultado
                );

            }
        );


        /*
         * Agregar resultado al buscador.
         */
        searchResults.appendChild(
            result
        );

    });


    /*
     * Mostrar lista de resultados.
     */
    searchResults.classList.add(
        'visible'
    );

}


/* =========================================================
   SELECCIONAR RESULTADO
   ========================================================= */

/**
 * Selecciona cualquier elemento encontrado.
 *
 * @param {Object} resultado Resultado seleccionado.
 *
 * @author Cristobal Torres Ramos
 * @version 1.4
 */
function selectSearchResult(resultado) {

    if (!resultado) {
        return;
    }


    let groupObject = null;


    /*
     * =====================================================
     * OBJETO DIRECTO DEL MODELO 3D
     * =====================================================
     */
    if (
        resultado.data &&
        resultado.data.object
    ) {

        groupObject =
            resultado.data.object;

    }


    /*
     * =====================================================
     * ELEMENTO DE LA BASE DE DATOS
     * =====================================================
     */
    else {

        groupObject =
            findMeshObjectForDbItem(
                resultado.data
            );

    }


    /*
     * =====================================================
     * SI NO SE ENCUENTRA EN EL MODELO
     * =====================================================
     */
    if (!groupObject) {

        console.warn(
            'No se encontró el objeto 3D para:',
            resultado
        );

        return;

    }


    /*
     * =====================================================
     * SELECCIONAR
     * =====================================================
     */
    selectedObject =
        groupObject;


    hoveredObject =
        null;


    updateOutlines();


    /*
     * =====================================================
     * MOSTRAR INFORMACIÓN
     * =====================================================
     *
     * Para edificios y áreas verdes se conserva
     * showDetails().
     *
     * Para las demás categorías utilizamos una
     * función genérica.
     */
    if (
        resultado.type === 'edificio' ||
        resultado.type === 'area-verde'
    ) {

        showDetails(
            resultado.type,
            resultado.data
        );

    } else {

        showGenericSearchDetails(
            resultado
        );

    }


    /*
     * =====================================================
     * CERRAR RESULTADOS
     * =====================================================
     */
    closeSearchResults();


    /*
     * =====================================================
     * ACTUALIZAR INPUT
     * =====================================================
     */
    const searchInput =
        document.getElementById(
            'map-search-input'
        );


    if (searchInput) {

        searchInput.value =
            resultado.nombre || '';

    }


    const clearButton =
        document.getElementById(
            'map-search-clear'
        );


    if (clearButton) {

        clearButton.style.display =
            'flex';

    }


    /*
     * =====================================================
     * CENTRAR CÁMARA
     * =====================================================
     */
    focusCameraOnObject(
        groupObject
    );

}


/* =========================================================
   INFORMACIÓN DE CANCHAS
   ========================================================= */

/**
 * Muestra información básica de una cancha.
 *
 * Si posteriormente agregas una tabla de canchas
 * en la base de datos, esta función puede sustituirse
 * por showDetails().
 *
 * @param {Object} cancha Información de la cancha.
 */
function showCourtDetails(cancha) {

    const cardTitle =
        document.getElementById(
            'card-title'
        );

    const cardBody =
        document.getElementById(
            'card-body'
        );


    if (!cardTitle || !cardBody) {
        return;
    }


    const nombre =
        cancha.nombre ||
        'Cancha deportiva';


    cardTitle.textContent =
        nombre;


    cardBody.innerHTML = `

        <div class="info-row">

            <div class="label">
                Tipo
            </div>

            <div class="value">
                Cancha deportiva
            </div>

        </div>

        <div class="info-row">

            <div class="label">
                Ubicación
            </div>

            <div class="value">
                Campus UTTECAM
            </div>

        </div>

    `;


    openDetailsCard();
}


/* =========================================================
   BUSCAR OBJETO 3D ASOCIADO A BD
   ========================================================= */

/**
 * Busca dentro del modelo 3D el objeto asociado
 * con un registro de la base de datos.
 *
 * @param {Object} item Registro de BD.
 * @return {THREE.Object3D|null} Objeto encontrado.
 */
function findMeshObjectForDbItem(item) {

    if (
        !item ||
        !interactiveObjects ||
        interactiveObjects.length === 0
    ) {

        return null;
    }


    /* =====================================================
       BUSCAR POR codigoMesh
       ===================================================== */

    if (item.codigoMesh) {

        const targetKey =
            normalizeKey(
                item.codigoMesh
            );


        for (
            let i = 0;
            i < interactiveObjects.length;
            i++
        ) {

            const mesh =
                interactiveObjects[i];


            const dbItem =
                findDbItemForMesh(
                    mesh
                );


            if (!dbItem) {
                continue;
            }


            if (
                dbItem.data &&
                dbItem.data.codigoMesh &&
                normalizeKey(
                    dbItem.data.codigoMesh
                ) === targetKey
            ) {

                return getGroupObject(
                    mesh
                );

            }

        }

    }


    /* =====================================================
       BUSCAR POR ID
       ===================================================== */

    if (
        item.id !== undefined
    ) {

        for (
            let i = 0;
            i < interactiveObjects.length;
            i++
        ) {

            const mesh =
                interactiveObjects[i];


            const dbItem =
                findDbItemForMesh(
                    mesh
                );


            if (
                dbItem &&
                dbItem.data &&
                dbItem.data.id === item.id
            ) {

                return getGroupObject(
                    mesh
                );

            }

        }

    }


    /* =====================================================
       BUSCAR POR NOMBRE
       ===================================================== */

    if (item.nombre) {

        const targetName =
            normalizeSearchText(
                item.nombre
            );


        for (
            let i = 0;
            i < interactiveObjects.length;
            i++
        ) {

            const mesh =
                interactiveObjects[i];


            const group =
                getGroupObject(
                    mesh
                );


            if (!group) {
                continue;
            }


            const objectName =
                normalizeSearchText(
                    group.name
                );


            if (
                objectName === targetName ||
                objectName.includes(targetName) ||
                targetName.includes(objectName)
            ) {

                return group;

            }

        }

    }


    return null;
}


/* =========================================================
   ANIMACIÓN DE CÁMARA
   ========================================================= */

/**
 * Anima suavemente la cámara hacia un objeto.
 *
 * La cámara conserva la orientación actual.
 * No se teletransporta directamente al objetivo.
 *
 * @param {THREE.Object3D} object Objeto seleccionado.
 */
function focusCameraOnObject(object) {

    if (
        !object ||
        !camera ||
        !controls
    ) {

        return;
    }


    const box =
        new THREE.Box3();


    box.setFromObject(
        object
    );


    const center =
        box.getCenter(
            new THREE.Vector3()
        );


    const size =
        box.getSize(
            new THREE.Vector3()
        );


    const maxDim =
        Math.max(
            size.x,
            size.y,
            size.z
        );


    /*
     * Conservar la dirección actual
     * de la cámara.
     */
    const direction =
        new THREE.Vector3()
            .subVectors(
                camera.position,
                controls.target
            )
            .normalize();


    /*
     * Distancia final.
     *
     * Para objetos pequeños utilizamos
     * una distancia mínima razonable.
     */
    const distance =
        Math.max(
            maxDim * 3.0,
            controls.minDistance + 10
        );


    const targetPosition =
        center.clone();


    const cameraPosition =
        center.clone()
            .add(
                direction.multiplyScalar(
                    distance
                )
            );


    /*
     * Guardar posiciones iniciales.
     */
    const startPosition =
        camera.position.clone();


    const startTarget =
        controls.target.clone();


    /*
     * Duración de la animación.
     *
     * 1800 ms = 1.8 segundos.
     *
     * Puedes aumentarlo a 2200 o 2500
     * si quieres una animación todavía más lenta.
     */
    const duration = 4800;


    const startTime =
        performance.now();


    /*
     * Evitar que una animación anterior
     * siga ejecutándose.
     */
    if (
        window.cameraFocusAnimation
    ) {

        cancelAnimationFrame(
            window.cameraFocusAnimation
        );

    }


    /**
     * Función de suavizado.
     *
     * Empieza lentamente,
     * acelera en el centro
     * y termina lentamente.
     */
    function easeInOutCubic(t) {

        return t < 0.5
            ? 4 * t * t * t
            : 1 -
            Math.pow(
                -2 * t + 2,
                3
            ) / 2;

    }


    function animateCameraFocus(currentTime) {

        const elapsed =
            currentTime -
            startTime;


        let progress =
            elapsed /
            duration;


        progress =
            Math.min(
                progress,
                1
            );


        const easedProgress =
            easeInOutCubic(
                progress
            );


        /*
         * Mover cámara.
         */
        camera.position.lerpVectors(
            startPosition,
            cameraPosition,
            easedProgress
        );


        /*
         * Mover objetivo.
         */
        controls.target.lerpVectors(
            startTarget,
            targetPosition,
            easedProgress
        );


        controls.update();


        if (
            progress < 1
        ) {

            window.cameraFocusAnimation =
                requestAnimationFrame(
                    animateCameraFocus
                );

        } else {

            window.cameraFocusAnimation =
                null;

        }

    }


    window.cameraFocusAnimation =
        requestAnimationFrame(
            animateCameraFocus
        );

}


/* =========================================================
   CERRAR RESULTADOS
   ========================================================= */

/**
 * Cierra el panel de resultados.
 */
function closeSearchResults() {

    const searchResults =
        document.getElementById(
            'map-search-results'
        );


    if (searchResults) {

        searchResults.classList.remove(
            'visible'
        );

    }

}


/* =========================================================
   INICIALIZAR BUSCADOR
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        setupMapSearch();

    }
);


/* =========================================================
   MOSTRAR INFORMACIÓN GENÉRICA
   ========================================================= */

/**
 * Muestra información básica de cualquier elemento
 * encontrado desde la base de datos.
 *
 * @param {Object} resultado Resultado seleccionado.
 *
 * @author Cristobal Torres Ramos
 * @version 1.4
 */
function showGenericSearchDetails(
    resultado
) {

    const cardTitle =
        document.getElementById(
            'card-title'
        );


    const cardBody =
        document.getElementById(
            'card-body'
        );


    if (
        !cardTitle ||
        !cardBody
    ) {

        return;

    }


    const nombre =
        resultado.nombre ||
        'Elemento del campus';


    const tipo =
        resultado.type ||
        'otro';


    const tipoTexto =
        obtenerTextoTipo(
            tipo
        );


    cardTitle.textContent =
        nombre;


    cardBody.innerHTML = `

        <div class="info-row">

            <div class="label">
                Tipo
            </div>

            <div class="value">
                ${tipoTexto}
            </div>

        </div>

    `;


    openDetailsCard();

}


/* =========================================================
   TEXTO DEL TIPO
   ========================================================= */

/**
 * Convierte el tipo interno en texto visible.
 *
 * @param {string} tipo Tipo interno.
 * @return {string} Texto visible.
 */
function obtenerTextoTipo(tipo) {

    switch (
    tipo
    ) {

        case 'edificio':
            return 'Edificio';

        case 'area-verde':
            return 'Zona verde';

        case 'estacionamiento':
            return 'Estacionamiento';

        case 'presa':
            return 'Presa';

        case 'invernadero':
            return 'Invernadero';

        case 'huerta':
            return 'Huerta';

        case 'cancha':
            return 'Cancha';

        default:
            return 'Lugar del campus';

    }

}


/* =========================================================
   SCROLL DEL BUSCADOR
   Evita que OrbitControls mueva el mapa mientras el
   usuario desplaza los resultados.
   ========================================================= */

function bloquearScrollMapaDesdeBuscador() {

    const searchContainer =
        document.getElementById('map-search-container');

    const searchResults =
        document.getElementById('map-search-results');

    if (searchContainer) {

        searchContainer.addEventListener(
            'wheel',
            function (event) {

                event.stopPropagation();

            },
            {
                passive: true
            }
        );

    }

    if (searchResults) {

        searchResults.addEventListener(
            'wheel',
            function (event) {

                event.stopPropagation();

            },
            {
                passive: true
            }
        );

    }

}
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        bloquearScrollMapaDesdeBuscador
    );

} else {

    bloquearScrollMapaDesdeBuscador();

}


/* =========================================================
   BUSCADOR RESPONSIVO
   En móviles comienza como una lupa y se expande
   al tocarla.
   ========================================================= */

function configurarBuscadorResponsivo() {

    const container =
        document.getElementById('map-search-container');

    const toggle =
        document.getElementById('map-search-toggle');

    const input =
        document.getElementById('map-search-input');

    const clear =
        document.getElementById('map-search-clear');

    if (!container || !toggle || !input) {
        return;
    }

    /*
     * Abrir buscador.
     */
    toggle.addEventListener('click', function (event) {

        event.preventDefault();
        event.stopPropagation();

        container.classList.add('search-open');

        toggle.setAttribute(
            'aria-expanded',
            'true'
        );

        setTimeout(function () {

            input.focus();

        }, 100);

    });

    /*
     * Evitar que el click llegue al mapa.
     */
    input.addEventListener(
        'click',
        function (event) {

            event.stopPropagation();

        }
    );

    /*
     * Limpiar búsqueda.
     */
    if (clear) {

        clear.addEventListener(
            'click',
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                input.value = '';

                input.dispatchEvent(
                    new Event('input', {
                        bubbles: true
                    })
                );

                input.focus();

            }
        );

    }

    /*
     * Si el usuario toca fuera del buscador
     * y no hay resultados visibles, se puede cerrar.
     */
    document.addEventListener(
        'pointerdown',
        function (event) {

            if (!container.contains(event.target)) {

                const resultados =
                    document.getElementById(
                        'map-search-results'
                    );

                const tieneResultados =
                    resultados &&
                    resultados.children.length > 0;

                if (!tieneResultados) {

                    container.classList.remove(
                        'search-open'
                    );

                    toggle.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                }

            }

        }
    );

}
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        configurarBuscadorResponsivo
    );

} else {

    configurarBuscadorResponsivo();

}