/*
    Autor: Cristobal Torres Ramos
    Proyecto: Mapa interactivo de la UTTECAM
*/

let scene, camera, renderer, controls;
let raycaster, mouse;
let interactiveObjects = [];
let hoveredObject = null;
let composer, outlinePass;
<<<<<<< HEAD
=======
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
>>>>>>> 0d0e749 (mapa-completo)

const container = document.getElementById('webgl-container');
const tooltip = document.getElementById('map-tooltip');
const detailsCard = document.getElementById('details-card');

<<<<<<< HEAD
=======
function normalizeKey(str) {
    if (!str) return '';
    return str.toString()
              .toLowerCase()
              .trim()
              .replace(/[\s\-_]+/g, '_');
}

function loadDbMapData() {
    fetch('/api/map-data')
        .then(res => res.json())
        .then(data => {
            dbItemsMap.clear();
            if (data.edificios) {
                data.edificios.forEach(item => {
                    const entry = { type: 'edificio', data: item, nombre: item.nombre };
                    if (item.codigoMesh) {
                        dbItemsMap.set(normalizeKey(item.codigoMesh), entry);
                    }
                    if (item.nombre) {
                        dbItemsMap.set(normalizeKey(item.nombre), entry);
                    }
                });
            }
            if (data.areasVerdes) {
                data.areasVerdes.forEach(item => {
                    const entry = { type: 'area-verde', data: item, nombre: item.nombre };
                    if (item.codigoMesh) {
                        dbItemsMap.set(normalizeKey(item.codigoMesh), entry);
                    }
                    if (item.nombre) {
                        dbItemsMap.set(normalizeKey(item.nombre), entry);
                    }
                });
            }


            //cargar etiquetas del mapa si el modelo ya está cargado
            if (mapModel) {
                buildMapLabels();
            }



        })
        .catch(err => console.error('Error al cargar datos del mapa desde BD:', err));
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


    if (
        !exploreButton ||
        !exploreMenu
    ) {
        return;
    }


    /*
     * Abrir / cerrar menú.
     */
    exploreButton.addEventListener(
        'click',
        function(event) {

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


    /*
     * Seleccionar categorías.
     */
    options.forEach(option => {

        option.addEventListener(
            'click',
            function(event) {

                event.stopPropagation();


                const category =
                    option.dataset.category;


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
                 * las etiquetas.
                 */
                updateMapLabels();

            }
        );

    });


    /*
     * Evitar que tocar dentro del menú
     * lo cierre.
     */
    exploreMenu.addEventListener(
        'click',
        function(event) {

            event.stopPropagation();

        }
    );


    /*
     * Cerrar al tocar fuera.
     */
    document.addEventListener(
        'click',
        function(event) {

            if (
                !event.target.closest(
                    '.explore-wrapper'
                )
            ) {

                closeExploreMenu();

            }

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























>>>>>>> 0d0e749 (mapa-completo)
init();
setupExploreMenu();
animate();


//Inicializa la escena, la cámara, el renderizador y los controles de Three.js
function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x807f7f);

    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(0, 50, 80);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);


    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        0.7
    );

    scene.add(ambientLight);


    const sunLight = new THREE.DirectionalLight(
        0xffffff,
        1.0
    );

    sunLight.position.set(50, 80, 50);
    sunLight.castShadow = true;

    scene.add(sunLight);


    controls = new THREE.OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;

    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2.5 - 0.05;

    controls.minDistance = 40;
    controls.maxDistance = 250;

    controls.target.set(0, 25, 0);
    controls.update();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();


    const loader = new THREE.GLTFLoader();
 
 
    // Cargar el modelo GLB del mapa
    loader.load(
        '/modelo/Mapa_UTTECAM.glb',
        function(gltf) {
 
            const model = gltf.scene;

            mapModel = model;

            scene.add(model);


            model.traverse(function(child) {

                if(child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                    interactiveObjects.push(child);

                }

            });

            /*
            * Crear las etiquetas después de cargar
            * completamente el modelo.
            */
            buildMapLabels();

            resetCameraView();


            const loaderScreen = document.getElementById('loader');

            if(loaderScreen) {

                loaderScreen.style.opacity = '0';

                setTimeout(function() {

                    loaderScreen.style.display = 'none';

                },500);

            }

        },
        function(xhr) {

            console.log(
                (xhr.loaded / xhr.total * 100) + '% cargado'
            );

        },
        function(error) {

            console.error(
                'Error al cargar la maqueta:',
                error
            );


            const loaderScreen = document.getElementById('loader');

            if(loaderScreen) {

                loaderScreen.innerHTML =
                '<h2>Error al cargar Mapa_UTTECAM.glb</h2><p>Asegúrate de que el archivo esté disponible en la ruta especificada</p>';

            }

        }
    );


    composer = new THREE.EffectComposer(
        renderer
    );


    const renderPass = new THREE.RenderPass(
        scene,
        camera
    );

    composer.addPass(renderPass);


    outlinePass = new THREE.OutlinePass(
        new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ),
        scene,
        camera
    );


    outlinePass.edgeStrength = 5.0;
    outlinePass.edgeGlow = 1.0;
    outlinePass.edgeThickness = 2.0;

    outlinePass.visibleEdgeColor.set('#4fd1c5');
    outlinePass.hiddenEdgeColor.set('#4fd1c5');


    composer.addPass(outlinePass);


    window.addEventListener(
        'resize',
        onWindowResize
    );

    window.addEventListener(
        'mousemove',
        onPointerMove
    );

    window.addEventListener(
        'click',
        onClick
    );

    window.addEventListener(
        'wheel',
        onMouseWheel,
        {
            passive:true
        }
    );

}

//Maneja el evento de movimiento del mouse para mostrar el tooltip y resaltar el objeto intersectado
function onPointerMove(event) {

<<<<<<< HEAD
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
=======

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

    updateMouseCoordinates(event);
>>>>>>> 0d0e749 (mapa-completo)

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
        interactiveObjects
    );


    if(intersects.length > 0) {

        const object = getGroupObject(
            intersects[0].object
        );


        if(hoveredObject !== object) {

            hoveredObject = object;

            outlinePass.selectedObjects = [
                hoveredObject
            ];

        }


        const cleanName = formatName(
            object.name
        );


        tooltip.textContent = cleanName;

        tooltip.style.left =
            `${event.clientX + 15}px`;

        tooltip.style.top =
            `${event.clientY + 15}px`;


        tooltip.classList.add(
            'visible'
        );


        document.body.style.cursor =
            'pointer';


    } else {


        if(hoveredObject) {

            hoveredObject = null;

            outlinePass.selectedObjects = [];

        }


        tooltip.classList.remove(
            'visible'
        );


        document.body.style.cursor =
            'default';

    }

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


    if(intersects.length > 0) {

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


    while(current.parent) {

        if(
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


//Maneja el evento de clic en la escena para mostrar los detalles del objeto seleccionado
function onClick(event) {

    raycaster.setFromCamera(
        mouse,
        camera
    );


    const intersects =
        raycaster.intersectObjects(
            interactiveObjects
        );


    if(intersects.length > 0) {


        const object =
            getGroupObject(
                intersects[0].object
            );


        const rawName =
            object.name;


        let identifier = rawName;


        let lowerName = rawName.toLowerCase();
        let type = (lowerName.includes('area') || lowerName.includes('zona') || 
                    lowerName.includes('cancha') || lowerName.includes('presa') || 
                    lowerName.includes('huerta') || lowerName.includes('invernadero') ||
                    lowerName.includes('camino') || lowerName.includes('pasillo')) 
            ? 'area-verde' 
            : 'edificio';


        fetchDetails(
            type,
            identifier,
            rawName
        );

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
function fetchDetails(type,id,rawName) {


    const url =
        type === 'edificio'
        ? `/api/edificios/${id}`
        : `/api/areas-verdes/${id}`;



    fetch(url)

    .then(function(res) {

        if(!res.ok) {

            throw new Error(
                'Sin detalles'
            );

        }


        return res.json();

    })


    .then(function(data) {

        showDetails(
            type,
            data
        );

    })


    .catch(function() {


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


        detailsCard.classList.add(
            'visible'
        );

    });

}


//Muestra los detalles del edificio o área verde en la tarjeta de detalles
function showDetails(type,data) {


    const cardTitle =
        document.getElementById(
            'card-title'
        );


    const cardBody =
        document.getElementById(
            'card-body'
        );



    if(type === 'edificio') {
        cardTitle.textContent = data.nombre;
        cardBody.innerHTML = `
            <div class="info-row">
                <div class="label">
                    Carreras / Uso
                </div>
                <div class="value">
                    ${data.carreras || 'General'}
                </div>
            </div>
        `;


    } else {


        cardTitle.textContent =
            data.nombre || 'Área Verde';


        cardBody.innerHTML = `

            <div class="info-row">

                <div class="label">
                    Ubicación / Sector
                </div>

                <div class="value">
                    ${data.sector || 'Campus General'}
                </div>

            </div>


            <div class="info-row">

                <div class="label">
                    Superficie
                </div>

                <div class="value">
                    ${data.superficie ? data.superficie + ' m²' : 'No especificada'}
                </div>

            </div>


            <div class="info-row">

                <div class="label">
                    Descripción
                </div>

                <div class="value">
                    ${data.descripcion || 'Área verde del campus'}
                </div>

            </div>

        `;

    }


    detailsCard.classList.add(
        'visible'
    );

}


//Cierra la tarjeta de detalles
function closeDetailsCard() {

    detailsCard.classList.remove(
        'visible'
    );

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

    composer.render();

}




//Ajusta la posición de la cámara para mostrar toda la maqueta en la vista
function resetCameraView() {

    const box =
        new THREE.Box3();


    interactiveObjects.forEach(function(obj) {

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



    if(hoveredObject) {

        hoveredObject = null;

        outlinePass.selectedObjects = [];

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

<<<<<<< HEAD
=======
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

document.addEventListener('DOMContentLoaded', function () {

    setupExploreMenu();

});
>>>>>>> 0d0e749 (mapa-completo)
