/**
 * Admin Panel JavaScript functionality
 * Handles dialogs, dynamic form actions, comboboxes, image previews, and live search.
 */

function getActiveSection() {
    const layout = document.querySelector('.admin-layout');
    return (layout && layout.getAttribute('data-active-section')) || 'edificios';
}

const sectionConfig = {
    'edificios': {
        addTitle: 'Agregar Nuevo Edificio',
        editTitle: 'Editar Edificio',
        addAction: '/admin-panel/add-edificio',
        editAction: '/admin-panel/edit-edificio',
        deleteAction: '/admin-panel/delete-edificio',
        label: 'el edificio',
        populateEdit: (button) => {
            document.getElementById('ed-codigoMesh').value = button.getAttribute('data-codigomesh') || '';
            document.getElementById('ed-nombre').value = button.getAttribute('data-nombre') || '';
            document.getElementById('ed-carrera').value = button.getAttribute('data-carreras') || '';

            const assetId = button.getAttribute('data-assetid') || '';
            const inputAsset = document.getElementById('ed-assetId');
            if (inputAsset) inputAsset.value = assetId;
            const removeFlag = document.getElementById('ed-removeImage');
            if (removeFlag) removeFlag.value = 'false';

            if (assetId) {
                showImagePreview('ed', '/images/custom/' + assetId);
            } else {
                hideImagePreview('ed');
            }
        }
    },
    'areas-verdes': {
        addTitle: 'Agregar Nueva Área Verde',
        editTitle: 'Editar Área Verde',
        addAction: '/admin-panel/add-area-verde',
        editAction: '/admin-panel/edit-area-verde',
        deleteAction: '/admin-panel/delete-area-verde',
        label: 'el área verde',
        populateEdit: (button) => {
            document.getElementById('av-codigoMesh').value = button.getAttribute('data-codigomesh') || '';
            document.getElementById('av-nombre').value = button.getAttribute('data-nombre') || '';
            document.getElementById('av-sector').value = button.getAttribute('data-sector') || '';
            document.getElementById('av-superficie').value = button.getAttribute('data-superficie') || '';
            document.getElementById('av-descripcion').value = button.getAttribute('data-descripcion') || '';

            const assetId = button.getAttribute('data-assetid') || '';
            const inputAsset = document.getElementById('av-assetId');
            if (inputAsset) inputAsset.value = assetId;
            const removeFlag = document.getElementById('av-removeImage');
            if (removeFlag) removeFlag.value = 'false';

            if (assetId) {
                showImagePreview('av', '/images/custom/' + assetId);
            } else {
                hideImagePreview('av');
            }
        }
    },
    'especie': {
        addTitle: 'Agregar Nueva Especie',
        editTitle: 'Editar Especie',
        addAction: '/admin-panel/add-especie',
        editAction: '/admin-panel/edit-especie',
        deleteAction: '/admin-panel/delete-especie',
        label: 'la especie',
        populateEdit: (button) => {
            document.getElementById('esp-nombre').value = button.getAttribute('data-nombre') || '';
            document.getElementById('esp-reino').value = button.getAttribute('data-reino') || 'Plantae';
            document.getElementById('esp-divisionPhylum').value = button.getAttribute('data-divisionphylum') || '';
            document.getElementById('esp-clase').value = button.getAttribute('data-clase') || '';
            document.getElementById('esp-subclase').value = button.getAttribute('data-subclase') || '';
            document.getElementById('esp-orden').value = button.getAttribute('data-orden') || '';
            document.getElementById('esp-familia').value = button.getAttribute('data-familia') || '';
            document.getElementById('esp-subfamilia').value = button.getAttribute('data-subfamilia') || '';
            document.getElementById('esp-genero').value = button.getAttribute('data-genero') || '';
            document.getElementById('esp-especie').value = button.getAttribute('data-especie') || '';
            document.getElementById('esp-variedad').value = button.getAttribute('data-variedad') || '';
            document.getElementById('esp-observaciones').value = button.getAttribute('data-observaciones') || '';

            const assetId = button.getAttribute('data-assetid') || '';
            document.getElementById('esp-assetId').value = assetId;
            const removeFlag = document.getElementById('esp-removeImage');
            if (removeFlag) removeFlag.value = 'false';

            if (assetId) {
                showImagePreview('esp', '/images/custom/' + assetId);
            } else {
                hideImagePreview('esp');
            }
        }
    }
};

function openComboboxDropdown() {
    const wrapper = document.getElementById('as-combobox-wrapper');
    if (wrapper) wrapper.classList.add('open');
}

function closeComboboxDropdown() {
    const wrapper = document.getElementById('as-combobox-wrapper');
    if (wrapper) wrapper.classList.remove('open');
}

function toggleComboboxDropdown(e) {
    if (e) e.stopPropagation();
    const wrapper = document.getElementById('as-combobox-wrapper');
    if (!wrapper) return;
    if (wrapper.classList.contains('open')) {
        closeComboboxDropdown();
    } else {
        openComboboxDropdown();
        const input = document.getElementById('as-species-combobox-input');
        if (input) input.focus();
    }
}

function handleComboboxInput(value) {
    openComboboxDropdown();
    const filter = (value || '').toLowerCase().trim();
    const options = document.querySelectorAll('#as-combobox-options-list .custom-combobox-option');
    let visibleCount = 0;
    let exactMatchId = '';

    options.forEach(opt => {
        const searchData = opt.getAttribute('data-search') || '';
        const label = (opt.getAttribute('data-label') || '').toLowerCase();
        
        if (searchData.includes(filter) || label.includes(filter)) {
            opt.style.display = 'block';
            visibleCount++;
        } else {
            opt.style.display = 'none';
        }

        if (label === filter) {
            exactMatchId = opt.getAttribute('data-id');
        }
    });

    document.getElementById('as-especieId').value = exactMatchId;

    const noResults = document.getElementById('as-combobox-no-results');
    if (noResults) {
        noResults.style.display = (visibleCount === 0 && options.length > 0) ? 'block' : 'none';
    }
}

function selectComboboxOption(element) {
    const id = element.getAttribute('data-id');
    const label = element.getAttribute('data-label');
    
    document.getElementById('as-especieId').value = id;
    const input = document.getElementById('as-species-combobox-input');
    if (input) input.value = label;

    document.querySelectorAll('#as-combobox-options-list .custom-combobox-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');

    closeComboboxDropdown();
}

function validateComboboxSpeciesSubmit() {
    const hiddenInput = document.getElementById('as-especieId');
    if (!hiddenInput || !hiddenInput.value) {
        alert('Por favor selecciona una especie válida de la lista desplegable.');
        return false;
    }
    return true;
}

function resetComboboxSpecies() {
    document.getElementById('as-especieId').value = '';
    const input = document.getElementById('as-species-combobox-input');
    if (input) input.value = '';
    handleComboboxInput('');
    closeComboboxDropdown();
}

function openAddSpeciesToAreaDialog(button) {
    const areaId = button.getAttribute('data-area-id');
    const areaNombre = button.getAttribute('data-area-nombre');
    document.getElementById('as-areaVerdeId').value = areaId;

    resetComboboxSpecies();

    document.getElementById('add-species-dialog-title').textContent = `Asignar Especie a "${areaNombre}"`;
    const dialog = document.getElementById('add-species-to-area-dialog');
    dialog.showModal();
}

function closeAddSpeciesToAreaDialog() {
    const dialog = document.getElementById('add-species-to-area-dialog');
    dialog.close();
    resetComboboxSpecies();
    document.getElementById('add-species-to-area-form').reset();
}

function confirmRemoveSpeciesFromArea(button) {
    const areaId = button.getAttribute('data-area-id');
    const especieId = button.getAttribute('data-especie-id');
    const especieNombre = button.getAttribute('data-especie-nombre');

    const dialog = document.getElementById('confirm-delete-dialog');
    const form = document.getElementById('delete-form');

    const idInput = document.getElementById('delete-item-id');
    if (idInput) idInput.disabled = true;

    const extra1 = document.getElementById('delete-extra-id1');
    const extra2 = document.getElementById('delete-extra-id2');
    if (extra1) { extra1.disabled = false; extra1.value = areaId; }
    if (extra2) { extra2.disabled = false; extra2.value = especieId; }

    document.getElementById('delete-confirm-message').textContent = `¿Deseas quitar la especie "${especieNombre}" de esta área verde?`;
    const subtext = document.getElementById('delete-confirm-subtext');
    if (subtext) subtext.textContent = 'La especie seguirá existiendo en el catálogo general.';

    const submitBtn = document.getElementById('delete-confirm-submit-btn');
    if (submitBtn) submitBtn.textContent = 'Quitar Especie';

    form.action = '/admin-panel/area-verde/remove-especie';
    dialog.showModal();
}

function showImagePreview(prefix, imageSrc) {
    const dropZone = document.getElementById(prefix + '-drop-zone');
    const dropContent = document.getElementById(prefix + '-drop-content');
    const previewContainer = document.getElementById(prefix + '-preview-container');
    const img = document.getElementById(prefix + '-image-preview');

    if (img) img.src = imageSrc;
    if (previewContainer) previewContainer.style.display = 'flex';
    if (dropContent) dropContent.style.display = 'none';
    if (dropZone) dropZone.classList.add('has-image');
}

function hideImagePreview(prefix) {
    const dropZone = document.getElementById(prefix + '-drop-zone');
    const dropContent = document.getElementById(prefix + '-drop-content');
    const previewContainer = document.getElementById(prefix + '-preview-container');
    const img = document.getElementById(prefix + '-image-preview');

    if (img) img.src = '';
    if (previewContainer) previewContainer.style.display = 'none';
    if (dropContent) dropContent.style.display = 'flex';
    if (dropZone) dropZone.classList.remove('has-image');
}

function previewImage(input, prefix) {
    const removeFlag = document.getElementById(prefix + '-removeImage');
    if (removeFlag) removeFlag.value = 'false';

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            showImagePreview(prefix, e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function removeSelectedImage(e, prefix) {
    if (e) {
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    const fileInput = document.getElementById(prefix + '-imagen');
    const existingInput = document.getElementById(prefix + '-assetId');
    const removeFlag = document.getElementById(prefix + '-removeImage');

    if (fileInput) fileInput.value = '';
    if (existingInput) existingInput.value = '';
    if (removeFlag) removeFlag.value = 'true';
    hideImagePreview(prefix);
}

function openAddDialogFor(entityKey) {
    const activeSec = getActiveSection();
    const key = entityKey || activeSec;
    const config = sectionConfig[key] || sectionConfig['edificios'];
    const dialog = document.getElementById('item-dialog');
    const form = document.getElementById('item-form');
    form.reset();
    document.getElementById('item-id').value = '';

    ['ed', 'av', 'esp'].forEach(prefix => {
        const removeFlag = document.getElementById(prefix + '-removeImage');
        if (removeFlag) removeFlag.value = 'false';
        hideImagePreview(prefix);
    });

    document.getElementById('dialog-title').textContent = config.addTitle;
    form.action = config.addAction;
    document.getElementById('dialog-submit-btn').textContent = 'Guardar';
    dialog.showModal();
}

function openAddDialog() {
    const activeSec = getActiveSection();
    openAddDialogFor(activeSec === 'seres-vivos' ? 'especie' : activeSec);
}

function openEditDialog(button) {
    const activeSec = getActiveSection();
    const entityKey = button.getAttribute('data-entity') || activeSec;
    const config = sectionConfig[entityKey] || sectionConfig['edificios'];
    const dialog = document.getElementById('item-dialog');
    const form = document.getElementById('item-form');
    form.reset();

    const id = button.getAttribute('data-id');
    document.getElementById('item-id').value = id;

    document.getElementById('dialog-title').textContent = config.editTitle;
    form.action = config.editAction;

    if (config.populateEdit) {
        config.populateEdit(button);
    }

    document.getElementById('dialog-submit-btn').textContent = 'Guardar Cambios';
    dialog.showModal();
}

function closeItemDialog() {
    const dialog = document.getElementById('item-dialog');
    dialog.close();
    document.getElementById('item-form').reset();
}

function deleteItemEntity(button) {
    const activeSec = getActiveSection();
    const entityKey = button.getAttribute('data-entity') || activeSec;
    const id = button.getAttribute('data-id');
    const nombre = button.getAttribute('data-nombre');
    deleteItem(id, nombre, entityKey);
}

function deleteItem(id, nombre, entityKey) {
    const activeSec = getActiveSection();
    const key = entityKey || activeSec;
    const config = sectionConfig[key] || sectionConfig['edificios'];
    const dialog = document.getElementById('confirm-delete-dialog');
    const form = document.getElementById('delete-form');
    
    const idInput = document.getElementById('delete-item-id');
    if (idInput) { idInput.disabled = false; idInput.value = id; }

    const extra1 = document.getElementById('delete-extra-id1');
    const extra2 = document.getElementById('delete-extra-id2');
    if (extra1) extra1.disabled = true;
    if (extra2) extra2.disabled = true;

    document.getElementById('delete-confirm-message').textContent = `¿Seguro que deseas eliminar ${config.label} "${nombre}"?`;
    const subtext = document.getElementById('delete-confirm-subtext');
    if (subtext) subtext.textContent = 'Esta acción no se puede deshacer.';

    const submitBtn = document.getElementById('delete-confirm-submit-btn');
    if (submitBtn) submitBtn.textContent = 'Eliminar';

    form.action = config.deleteAction;

    dialog.showModal();
}

function closeConfirmDeleteDialog() {
    const dialog = document.getElementById('confirm-delete-dialog');
    dialog.close();
}

function filterTableItems(query) {
    const filter = (query || '').toLowerCase().trim();
    const rows = document.querySelectorAll('.content-body .data-table tbody tr');
    
    rows.forEach(row => {
        // Ignore empty state rows
        if (row.cells.length === 1 && row.cells[0].classList.contains('text-center')) {
            return;
        }
        const text = row.textContent.toLowerCase();
        if (text.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function setupDragAndDrop(prefix) {
    const dropZone = document.getElementById(prefix + '-drop-zone');
    const fileInput = document.getElementById(prefix + '-imagen');
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('click', () => {
        if (dropZone.classList.contains('has-image')) return;
        fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!dropZone.classList.contains('has-image')) {
                dropZone.classList.add('drag-over');
            }
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        if (dropZone.classList.contains('has-image')) return;
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            fileInput.files = dataTransfer.files;
            previewImage(fileInput, prefix);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupDragAndDrop('ed');
    setupDragAndDrop('av');
    setupDragAndDrop('esp');
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('as-combobox-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            closeComboboxDropdown();
        }
    });
});
