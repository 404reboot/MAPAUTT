/*
    Autor: Cristobal Torres Ramos
    Proyecto: Mapa interactivo de la UTTECAM
*/

let scene, camera, renderer, controls;
let raycaster, mouse;
let interactiveObjects = [];
let hoveredObject = null;
let composer, outlinePass;

const container = document.getElementById('webgl-container');
const tooltip = document.getElementById('map-tooltip');
const detailsCard = document.getElementById('details-card');

init();
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

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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

