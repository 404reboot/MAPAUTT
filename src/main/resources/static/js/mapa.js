/**
 * mapa.js - Three.js interactive campus map viewer.
 *
 * Loads a GLB 3D model and binds interactive locations from the server registry.
 * Clicking a registered location fetches its detail from the REST API and
 * displays it in a DOM overlay card using safe createElement + textContent.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const GLB_MODEL_PATH = '/models/Mapa_UTTECAM.glb';
const API_LOCATIONS = '/api/map/locations';

let scene, camera, renderer, controls;
let raycaster, mouse;
const interactiveObjects = [];

document.addEventListener('DOMContentLoaded', () => {
    initScene();
    initRaycaster();
    loadInventoryAndModel();
    animate();
});

/**
 * Initializes Three.js scene, camera, renderer, and orbit controls.
 */
function initScene() {
    const container = document.getElementById('map-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        2000
    );
    camera.position.set(100, 150, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

/**
 * Initializes raycaster and click event listener.
 */
function initRaycaster() {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', onMapClick);
}

/**
 * Fetches the location inventory from the API and loads the GLB model.
 * Binds inventory entries to the scene objects by exact glbObjectName match.
 */
async function loadInventoryAndModel() {
    let inventory = [];
    try {
        const response = await fetch(API_LOCATIONS);
        if (response.ok) {
            inventory = await response.json();
        } else {
            console.warn('Failed to fetch location inventory:', response.status);
        }
    } catch (err) {
        console.warn('Error fetching location inventory:', err);
    }

    const loader = new GLTFLoader();
    loader.load(
        GLB_MODEL_PATH,
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);
            bindInventoryToScene(inventory, model);
        },
        undefined,
        (error) => {
            console.error('Error loading GLB model:', error);
        }
    );
}

/**
 * Binds inventory entries to the loaded GLB scene.
 * For each entry, finds the scene-root group by exact glbObjectName match,
 * attaches metadata to userData, and registers descendant meshes as interactive.
 *
 * @param {Array} inventory - Array of location summary objects from the API
 * @param {THREE.Object3D} model - The loaded GLB scene root
 */
function bindInventoryToScene(inventory, model) {
    for (const entry of inventory) {
        const group = model.getObjectByName(entry.glbObjectName);
        if (!group) {
            console.warn(
                `GLB object not found for registry entry: "${entry.glbObjectName}" (mapKey: ${entry.mapKey})`
            );
            continue;
        }

        // Attach metadata to the group itself
        group.userData.mapKey = entry.mapKey;
        group.userData.locationType = entry.locationType;
        group.userData.displayName = entry.displayName;

        // Traverse descendants and attach metadata to all meshes
        group.traverse((child) => {
            if (child.isMesh) {
                child.userData.mapKey = entry.mapKey;
                child.userData.locationType = entry.locationType;
                child.userData.displayName = entry.displayName;
                interactiveObjects.push(child);
            }
        });
    }
}

/**
 * Click handler: performs raycast against interactive objects and fetches detail.
 *
 * @param {MouseEvent} event
 */
async function onMapClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, false);

    if (intersects.length === 0) {
        return;
    }

    const hit = intersects[0].object;
    const mapKey = hit.userData.mapKey;

    if (!mapKey) {
        return;
    }

    try {
        const response = await fetch(`${API_LOCATIONS}/${encodeURIComponent(mapKey)}`);
        if (response.ok) {
            const detail = await response.json();
            renderDetailCard(detail);
        } else if (response.status === 404) {
            console.warn(`Location detail not found for mapKey: ${mapKey}`);
            renderFallbackCard(mapKey);
        } else {
            console.warn(`Unexpected response for mapKey ${mapKey}:`, response.status);
        }
    } catch (err) {
        console.error('Error fetching location detail:', err);
    }
}

/**
 * Renders the detail card overlay using only safe DOM operations.
 * Uses createElement and textContent exclusively - never innerHTML with dynamic data.
 *
 * @param {Object} data - LocationDetailDto from the API
 */
function renderDetailCard(data) {
    closeCard();

    const overlay = document.createElement('div');
    overlay.className = 'detail-card';
    overlay.id = 'location-card';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', closeCard);
    overlay.appendChild(closeBtn);

    // Title
    const title = document.createElement('h2');
    title.textContent = data.displayName || data.mapKey;
    overlay.appendChild(title);

    // Location type badge
    const typeBadge = document.createElement('span');
    typeBadge.className = 'type-badge';
    typeBadge.textContent = formatLocationType(data.locationType);
    overlay.appendChild(typeBadge);

    // Description
    if (data.description) {
        const descSection = document.createElement('p');
        descSection.className = 'description';
        descSection.textContent = data.description;
        overlay.appendChild(descSection);
    }

    // Type-specific details
    if (data.details) {
        const detailsSection = document.createElement('div');
        detailsSection.className = 'details-section';

        if (data.locationType === 'INSTALACION') {
            renderInstalacionDetails(detailsSection, data.details);
        } else if (data.locationType === 'AREA_VERDE') {
            renderAreaVerdeDetails(detailsSection, data.details);
        }

        overlay.appendChild(detailsSection);
    }

    document.body.appendChild(overlay);
}

/**
 * Renders installation-specific fields into the details section.
 *
 * @param {HTMLElement} container
 * @param {Object} details - InstalacionDetailDto
 */
function renderInstalacionDetails(container, details) {
    if (details.facilityType) {
        appendField(container, 'Tipo de Instalacion', formatFacilityType(details.facilityType));
    }
    if (details.useDescription) {
        appendField(container, 'Uso', details.useDescription);
    }
    if (details.academicPrograms) {
        appendField(container, 'Programas Academicos', details.academicPrograms);
    }
    if (details.floorCount != null) {
        appendField(container, 'Pisos', String(details.floorCount));
    }
    if (details.operationalStatus) {
        appendField(container, 'Estado', formatOperationalStatus(details.operationalStatus));
    }
}

/**
 * Renders green-area-specific fields into the details section.
 *
 * @param {HTMLElement} container
 * @param {Object} details - AreaVerdeDetailDto
 */
function renderAreaVerdeDetails(container, details) {
    if (details.sector) {
        appendField(container, 'Sector', details.sector);
    }
    if (details.surfaceArea != null) {
        appendField(container, 'Superficie', details.surfaceArea + ' m\u00B2');
    }
}

/**
 * Appends a labeled field to a container using safe DOM operations.
 *
 * @param {HTMLElement} container
 * @param {string} label
 * @param {string} value
 */
function appendField(container, label, value) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'field-label';
    labelSpan.textContent = label + ':';
    fieldDiv.appendChild(labelSpan);

    const valueSpan = document.createElement('span');
    valueSpan.className = 'field-value';
    valueSpan.textContent = value;
    fieldDiv.appendChild(valueSpan);

    container.appendChild(fieldDiv);
}

/**
 * Renders a fallback card for locations missing database detail (404 response).
 *
 * @param {string} mapKey - The map key that was not found
 */
function renderFallbackCard(mapKey) {
    closeCard();

    const overlay = document.createElement('div');
    overlay.className = 'detail-card fallback-card';
    overlay.id = 'location-card';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', closeCard);
    overlay.appendChild(closeBtn);

    // Warning title
    const title = document.createElement('h2');
    title.textContent = 'Informacion no disponible';
    overlay.appendChild(title);

    // Warning message
    const message = document.createElement('p');
    message.className = 'fallback-message';
    message.textContent = 'Informacion no disponible - configuracion pendiente';
    overlay.appendChild(message);

    // Map key for reference
    const keyInfo = document.createElement('p');
    keyInfo.className = 'fallback-key';
    keyInfo.textContent = 'Clave: ' + mapKey;
    overlay.appendChild(keyInfo);

    document.body.appendChild(overlay);
}

/**
 * Closes and removes any existing detail card from the DOM.
 */
function closeCard() {
    const existing = document.getElementById('location-card');
    if (existing) {
        existing.remove();
    }
}

/**
 * Animation loop.
 */
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// --- Formatting helpers ---

function formatLocationType(type) {
    switch (type) {
        case 'INSTALACION': return 'Instalacion';
        case 'AREA_VERDE': return 'Area Verde';
        default: return type;
    }
}

function formatFacilityType(type) {
    switch (type) {
        case 'BUILDING': return 'Edificio';
        case 'SPORTS': return 'Deportivo';
        case 'PARKING': return 'Estacionamiento';
        case 'SERVICE': return 'Servicio';
        case 'PATH': return 'Camino';
        case 'WATER_LAND': return 'Terreno/Agua';
        case 'OTHER': return 'Otro';
        default: return type;
    }
}

function formatOperationalStatus(status) {
    switch (status) {
        case 'ACTIVE': return 'Activo';
        case 'MAINTENANCE': return 'En Mantenimiento';
        case 'CLOSED': return 'Cerrado';
        case 'PLANNED': return 'Planeado';
        default: return status;
    }
}
