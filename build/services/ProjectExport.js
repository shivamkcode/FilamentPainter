import { getFilamentListElements } from "../ui/Filaments.js";
import { LocalStorageService } from "./LocalStorage.js";
export class ProjectExportService {
    static exportProject(projectName = "FilamentPainter_Project") {
        try {
            const filaments = this.getCurrentFilaments();
            const settings = this.getCurrentSettings();
            const projectData = {
                version: this.PROJECT_VERSION,
                name: projectName,
                description: `Filament Painter project with ${filaments.length} filaments`,
                createdAt: new Date().toISOString(),
                filaments: filaments,
                settings: settings
            };
            this.downloadProjectFile(projectData, projectName);
            console.log('Project exported successfully:', projectName);
        }
        catch (error) {
            console.error('Error exporting project:', error);
            alert('Failed to export project. Please try again.');
        }
    }
    static downloadProjectFile(projectData, projectName) {
        const jsonData = JSON.stringify(projectData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectName}${this.FILE_EXTENSION}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    static importProject(projectFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = event.target?.result;
                    const projectData = JSON.parse(content);
                    if (!this.validateProjectData(projectData)) {
                        throw new Error('Invalid project file format');
                    }
                    console.log('Project imported successfully:', projectData.name);
                    resolve(projectData);
                }
                catch (error) {
                    console.error('Error importing project:', error);
                    reject(new Error('Failed to import project. Invalid file format.'));
                }
            };
            reader.onerror = () => {
                reject(new Error('Failed to read project file.'));
            };
            reader.readAsText(projectFile);
        });
    }
    static applyProjectData(projectData) {
        try {
            this.applySettings(projectData.settings);
            this.storeImportedFilaments(projectData.filaments);
            if (confirm(`Project "${projectData.name}" imported successfully! Reload the page to apply all changes?`)) {
                window.location.reload();
            }
        }
        catch (error) {
            console.error('Error applying project data:', error);
            alert('Failed to apply project data. Please try again.');
        }
    }
    static getCurrentFilaments() {
        return getFilamentListElements();
    }
    static getCurrentSettings() {
        const topographyFunction = document.getElementById('height-option-selection')?.value || 'nearest';
        const layerHeight = parseFloat(document.getElementById('layer-height-input')?.value || '0.08');
        const baseLayerHeight = parseFloat(document.getElementById('base-layer-height-input')?.value || '0.2');
        const detailSize = parseFloat(document.getElementById('detail-size')?.value || '0.2');
        const physicalX = parseFloat(document.getElementById('physical-x')?.value || '100');
        const physicalY = parseFloat(document.getElementById('physical-y')?.value || '100');
        const imageResolutionX = parseInt(document.getElementById('image-resolution-x')?.value || '0');
        const imageResolutionY = parseInt(document.getElementById('image-resolution-y')?.value || '0');
        return {
            topographyFunction,
            layerHeight,
            baseLayerHeight,
            detailSize,
            physicalX,
            physicalY,
            imageResolutionX,
            imageResolutionY
        };
    }
    static applySettings(settings) {
        const heightSelect = document.getElementById('height-option-selection');
        const layerHeightInput = document.getElementById('layer-height-input');
        const baseLayerHeightInput = document.getElementById('base-layer-height-input');
        const detailSizeInput = document.getElementById('detail-size');
        const physicalXInput = document.getElementById('physical-x');
        const physicalYInput = document.getElementById('physical-y');
        if (heightSelect)
            heightSelect.value = settings.topographyFunction;
        if (layerHeightInput)
            layerHeightInput.value = settings.layerHeight.toString();
        if (baseLayerHeightInput)
            baseLayerHeightInput.value = settings.baseLayerHeight.toString();
        if (detailSizeInput)
            detailSizeInput.value = settings.detailSize.toString();
        if (physicalXInput)
            physicalXInput.value = settings.physicalX.toString();
        if (physicalYInput)
            physicalYInput.value = settings.physicalY.toString();
    }
    static storeImportedFilaments(filaments) {
        LocalStorageService.saveFilaments(filaments);
    }
    static validateProjectData(data) {
        return (data &&
            typeof data === 'object' &&
            typeof data.version === 'string' &&
            typeof data.name === 'string' &&
            typeof data.description === 'string' &&
            typeof data.createdAt === 'string' &&
            Array.isArray(data.filaments) &&
            typeof data.settings === 'object' &&
            data.settings !== null);
    }
    static isValidProjectFile(file) {
        return file.name.endsWith(this.FILE_EXTENSION) || file.type === 'application/json';
    }
}
ProjectExportService.PROJECT_VERSION = "1.0.0";
ProjectExportService.FILE_EXTENSION = ".fpp";
