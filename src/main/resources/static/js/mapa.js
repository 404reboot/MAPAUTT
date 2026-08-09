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

init();
animate();


//Inicializa la escena, la cámara, el renderizador y los controles de Three.js
function init() {

    loadDbMapData();

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

            scene.add(model);


            model.traverse(function(child) {

                if(child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                    interactiveObjects.push(child);

                }

            });


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

    renderer.domElement.addEventListener(
        'pointerdown',
        onPointerDown
    );

    renderer.domElement.addEventListener(
        'touchstart',
        onPointerDown,
        { passive: true }
    );

    renderer.domElement.addEventListener(
        'pointerup',
        onPointerUp
    );

    renderer.domElement.addEventListener(
        'touchend',
        onPointerUp
    );

    renderer.domElement.addEventListener(
        'click',
        onPointerUp
    );

    window.addEventListener(
        'wheel',
        onMouseWheel,
        {
            passive:true
        }
    );

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

    if (event.pointerType === 'touch' || isTouchDevice) {
        if (hoveredObject) {
            hoveredObject = null;
            updateOutlines();
        }
        tooltip.classList.remove('visible');
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

//Muestra los detalles del edificio o área verde en la tarjeta de detalles
function showDetails(type, data) {
    const cardTitle = document.getElementById('card-title');
    const cardBody = document.getElementById('card-body');
    const backBtn = document.getElementById('card-back-btn');

    if (backBtn) backBtn.style.display = 'none';

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

function showSpeciesDetails(especieId) {
    if (!currentAreaVerdeData || !currentAreaVerdeData.especies) return;

    const speciesList = Array.isArray(currentAreaVerdeData.especies) 
        ? currentAreaVerdeData.especies 
        : Object.values(currentAreaVerdeData.especies);

    const especie = speciesList.find(e => e.id == especieId);
    if (!especie) return;

    const cardTitle = document.getElementById('card-title');
    const cardBody = document.getElementById('card-body');
    const backBtn = document.getElementById('card-back-btn');

    if (backBtn) backBtn.style.display = 'inline-flex';
    cardTitle.textContent = especie.nombre;

    let imgHtml = '';
    if (especie.assetId) {
        imgHtml = `<img src="/images/custom/${especie.assetId}" class="species-detail-img" alt="${especie.nombre}">`;
    }

    const reinoClass = especie.reino ? 'reino-' + especie.reino.toLowerCase() : '';

    cardBody.innerHTML = `
        ${imgHtml}
        
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
}

function goBackToAreaCard() {
    if (currentAreaVerdeData) {
        showDetails('area-verde', currentAreaVerdeData);
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
    detailsCard.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches.length === 1) {
            onDragStart(e.touches[0].clientY);
        }
    }, { passive: true });

    detailsCard.addEventListener('touchmove', function(e) {
        if (e.touches && e.touches.length === 1) {
            onDragMove(e.touches[0].clientY);
        }
    }, { passive: true });

    detailsCard.addEventListener('touchend', function() {
        onDragEnd();
    });

    // Eventos de puntero para simular arrastre en navegador/PC DevTools
    detailsCard.addEventListener('pointerdown', function(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        onDragStart(e.clientY);
    });

    window.addEventListener('pointermove', function(e) {
        if (isDragging) {
            onDragMove(e.clientY);
        }
    });

    window.addEventListener('pointerup', function() {
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



    if(hoveredObject || selectedObject) {

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

