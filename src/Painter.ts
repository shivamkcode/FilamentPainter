import {config} from "./config/Config.js";
import {handleImageUpload} from "./Upload.js";
import {getComputeFunction, GLComputeHeights} from "./gl/compute/Heights.js";
import {GLImage} from "./gl/Image.js";
import {debugDisplayDataOutput, debugDisplayHTMLImage} from "./debug/DisplayImage.js";
import {getFilamentListElements, setupDragAndDrop, saveFilamentsToStorage, loadFilamentsFromStorage, hasSavedFilaments, clearSavedFilaments} from './ui/Filaments.js';
import {setupHeightSelector} from "./ui/Heights.js";
import {HeightFunction} from "./config/Paint.js";
import {generateLargeHeightmap, generateSTLAndDownload, getHeights} from "./tools/HeightmapExport.js";
import {setupPreviewWindow} from "./ui/PreviewWindow.js";
import {initGL} from "./gl/Init.js";
import {autoUpdateImage, updateImage, updateOtherField} from "./ui/UpdateImage.js";
import {setupExport} from "./ui/Export.js";
import { ProjectExportService } from './services/ProjectExport.js';

initGL();

const imageResolutionX = document.getElementById('image-resolution-x') as HTMLInputElement;
const imageResolutionY = document.getElementById('image-resolution-y') as HTMLInputElement;
const physicalXInput = document.getElementById('physical-x') as HTMLInputElement;

handleImageUpload('image-upload', (result) => {
    if (result.error) {
        console.error('Image upload error:', result.error);
    } else if (result.imageElement) {
        config.paint.image = result.imageElement;
        config.paint.sourceImage = result.imageElement;

        imageResolutionX.value = `${config.paint.image.width}`;
        imageResolutionY.value = `${config.paint.image.height}`;
        physicalXInput.value = '100';
        updateOtherField(physicalXInput);

        updateImage();
    }
});


setupPreviewWindow();
setupHeightSelector();

const baseLayerHeight = document.getElementById('base-layer-height-input') as HTMLInputElement;
const endLayerHeight = document.getElementById('end-layer-height-label') as HTMLElement;

baseLayerHeight.addEventListener('input', () => {
    const filaments = getFilamentListElements();
    let height = parseFloat(baseLayerHeight.value);
    for (let i = 0; i < filaments.length; i++) {
        height +=  filaments[i].layerHeight;
    }
    endLayerHeight.innerHTML = `End Height: ${height.toString()} mm`;
});


document.addEventListener('DOMContentLoaded', () => {
    // Load saved filaments if they exist
    if (hasSavedFilaments()) {
        console.log('Found saved filaments, loading...');
        loadFilamentsFromStorage();
    }

    setupDragAndDrop((list: HTMLUListElement) => {
        const filaments = getFilamentListElements();
        let height = parseFloat(baseLayerHeight.value);
        for (let i = 0; i < filaments.length; i++) {
            height += filaments[i].layerHeight;
        }
        height = Math.round(height * 100) / 100;
        endLayerHeight.innerHTML = `End Height: ${height.toString()} mm`;

        // Auto-save filaments when they change
        saveFilamentsToStorage();

        autoUpdateImage();
    });

    // Add localStorage control button event listeners
    const saveButton = document.getElementById('save-filaments-button') as HTMLButtonElement;
    const loadButton = document.getElementById('load-filaments-button') as HTMLButtonElement;
    const clearButton = document.getElementById('clear-filaments-button') as HTMLButtonElement;
    const saveStatus = document.getElementById('save-status') as HTMLElement;

    // Update save status display
    const updateSaveStatus = () => {
        if (hasSavedFilaments()) {
            const lastSaved = new Date().toLocaleString();
            saveStatus.innerHTML = `✅ Filaments saved (${lastSaved})`;
            saveStatus.style.color = '#4CAF50';
        } else {
            saveStatus.innerHTML = 'No filaments saved yet';
            saveStatus.style.color = '#666';
        }
    };

    // Save button
    saveButton?.addEventListener('click', () => {
        saveFilamentsToStorage();
        updateSaveStatus();
        console.log('Filaments manually saved');
    });

    // Load button
    loadButton?.addEventListener('click', () => {
        if (hasSavedFilaments()) {
            loadFilamentsFromStorage();
            updateSaveStatus();
            console.log('Filaments manually loaded');
        } else {
            alert('No saved filaments found');
        }
    });

    // Clear button
    clearButton?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all saved filaments? This cannot be undone.')) {
            clearSavedFilaments();
            updateSaveStatus();
            console.log('Saved filaments cleared');
        }
    });

    // Initial status update
    updateSaveStatus();

    // How to Use Modal Functionality
    const modal = document.getElementById('how-to-use-modal') as HTMLElement;
    const howToUseLink = document.getElementById('how-to-use-link') as HTMLAnchorElement;
    const closeModal = document.querySelector('.close-modal') as HTMLElement;
    const closeModalBtn = document.querySelector('.close-modal-btn') as HTMLButtonElement;

    // Open modal
    howToUseLink?.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });

    // Close modal functions
    const closeModalFunction = () => {
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
      }
    };

    // Close on X button
    closeModal?.addEventListener('click', closeModalFunction);

    // Close on "Got it! Close" button
    closeModalBtn?.addEventListener('click', closeModalFunction);

    // Close on outside click
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModalFunction();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('show')) {
        closeModalFunction();
      }
    });

    // Export as Project
    const exportProjectBtn = document.getElementById('export-project-btn') as HTMLButtonElement;
    console.log('Export project button found:', exportProjectBtn);
    if (exportProjectBtn) {
        exportProjectBtn.addEventListener('click', () => {
            console.log('Export project button clicked');
            try {
                ProjectExportService.exportProject();
            } catch (error) {
                console.error('Error in export project:', error);
                alert('Export failed: ' + (error as Error).message);
            }
        });
    } else {
        console.error('Export project button not found!');
    }

    // Import Project
    let importProjectInput = document.getElementById('import-project-input') as HTMLInputElement;
    
    if (!importProjectInput) {
        importProjectInput = document.createElement('input');
        importProjectInput.type = 'file';
        importProjectInput.accept = '.fpp,application/json';
        importProjectInput.style.display = 'none';
        importProjectInput.id = 'import-project-input';
        document.body.appendChild(importProjectInput);
        console.log('Created import project input element');
    }
    
    const importProjectBtn = document.getElementById('import-project-btn') as HTMLButtonElement;
    console.log('Import project button found:', importProjectBtn);
    if (importProjectBtn) {
        importProjectBtn.addEventListener('click', () => {
            console.log('Import project button clicked');
            importProjectInput.click();
        });
    } else {
        console.error('Import project button not found!');
    }
    
    // Handle project file selection
    importProjectInput.addEventListener('change', (e) => {
        console.log('Project file selected');
        const projectFile = importProjectInput.files?.[0];
        if (projectFile && ProjectExportService.isValidProjectFile(projectFile)) {
            console.log('Valid project file selected:', projectFile.name);
            
            // Import project
            ProjectExportService.importProject(projectFile)
                .then(data => {
                    console.log('Project imported successfully:', data.name);
                    ProjectExportService.applyProjectData(data);
                })
                .catch(err => {
                    console.error('Import error:', err);
                    alert(err.message);
                });
        } else {
            console.log('Invalid project file selected');
            alert('Please select a valid Filament Painter Project file (.fpp)');
        }
        importProjectInput.value = '';
    });
});

setupExport();

document.getElementById("buy-commercial")?.addEventListener("click", () => {
    window.open("https://ko-fi.com/s/1d20470ee2", "_blank");
});