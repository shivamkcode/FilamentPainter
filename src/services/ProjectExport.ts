import { FilamentData, getFilamentListElements } from "../ui/Filaments.js";
import { LocalStorageService } from "./LocalStorage.js";

// We'll need to add JSZip library for ZIP functionality
// For now, let's create a simple implementation that exports both files separately

export interface ProjectData {
    version: string;
    name: string;
    description: string;
    createdAt: string;
    filaments: FilamentData[];
    settings: {
        topographyFunction: string;
        layerHeight: number;
        baseLayerHeight: number;
        detailSize: number;
        physicalX: number;
        physicalY: number;
        imageResolutionX: number;
        imageResolutionY: number;
    };
}

export class ProjectExportService {
    private static readonly PROJECT_VERSION = "1.0.0";
    private static readonly FILE_EXTENSION = ".fpp";

    /**
     * Export current project data as a downloadable JSON file
     */
    static exportProject(projectName: string = "FilamentPainter_Project"): void {
        try {
            // Get current filaments
            const filaments = this.getCurrentFilaments();
            
            // Get current settings
            const settings = this.getCurrentSettings();
            
            // Create project data
            const projectData: ProjectData = {
                version: this.PROJECT_VERSION,
                name: projectName,
                description: `Filament Painter project with ${filaments.length} filaments`,
                createdAt: new Date().toISOString(),
                filaments: filaments,
                settings: settings
            };

            // Export project file
            this.downloadProjectFile(projectData, projectName);
            
            console.log('Project exported successfully:', projectName);
        } catch (error) {
            console.error('Error exporting project:', error);
            alert('Failed to export project. Please try again.');
        }
    }

    /**
     * Download the project file (.fpp)
     */
    private static downloadProjectFile(projectData: ProjectData, projectName: string): void {
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

    /**
     * Import project from a JSON file
     */
    static importProject(projectFile: File): Promise<ProjectData> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const content = event.target?.result as string;
                    const projectData: ProjectData = JSON.parse(content);
                    
                    // Validate project data
                    if (!this.validateProjectData(projectData)) {
                        throw new Error('Invalid project file format');
                    }
                    
                    console.log('Project imported successfully:', projectData.name);
                    resolve(projectData);
                } catch (error) {
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

    /**
     * Apply imported project data to the current interface
     */
    static applyProjectData(projectData: ProjectData): void {
        try {
            // Apply settings
            this.applySettings(projectData.settings);
            
            // Apply filaments
            this.storeImportedFilaments(projectData.filaments);
            
            // Reload the page to apply all changes
            if (confirm(`Project "${projectData.name}" imported successfully! Reload the page to apply all changes?`)) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error applying project data:', error);
            alert('Failed to apply project data. Please try again.');
        }
    }

    /**
     * Get current filaments from the UI
     */
    private static getCurrentFilaments(): FilamentData[] {
        return getFilamentListElements();
    }

    /**
     * Get current settings from the UI
     */
    private static getCurrentSettings() {
        const topographyFunction = (document.getElementById('height-option-selection') as HTMLSelectElement)?.value || 'nearest';
        const layerHeight = parseFloat((document.getElementById('layer-height-input') as HTMLInputElement)?.value || '0.08');
        const baseLayerHeight = parseFloat((document.getElementById('base-layer-height-input') as HTMLInputElement)?.value || '0.2');
        const detailSize = parseFloat((document.getElementById('detail-size') as HTMLInputElement)?.value || '0.2');
        const physicalX = parseFloat((document.getElementById('physical-x') as HTMLInputElement)?.value || '100');
        const physicalY = parseFloat((document.getElementById('physical-y') as HTMLInputElement)?.value || '100');
        const imageResolutionX = parseInt((document.getElementById('image-resolution-x') as HTMLInputElement)?.value || '0');
        const imageResolutionY = parseInt((document.getElementById('image-resolution-y') as HTMLInputElement)?.value || '0');

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

    /**
     * Apply settings to the UI
     */
    private static applySettings(settings: ProjectData['settings']): void {
        const heightSelect = document.getElementById('height-option-selection') as HTMLSelectElement;
        const layerHeightInput = document.getElementById('layer-height-input') as HTMLInputElement;
        const baseLayerHeightInput = document.getElementById('base-layer-height-input') as HTMLInputElement;
        const detailSizeInput = document.getElementById('detail-size') as HTMLInputElement;
        const physicalXInput = document.getElementById('physical-x') as HTMLInputElement;
        const physicalYInput = document.getElementById('physical-y') as HTMLInputElement;

        if (heightSelect) heightSelect.value = settings.topographyFunction;
        if (layerHeightInput) layerHeightInput.value = settings.layerHeight.toString();
        if (baseLayerHeightInput) baseLayerHeightInput.value = settings.baseLayerHeight.toString();
        if (detailSizeInput) detailSizeInput.value = settings.detailSize.toString();
        if (physicalXInput) physicalXInput.value = settings.physicalX.toString();
        if (physicalYInput) physicalYInput.value = settings.physicalY.toString();
    }

    /**
     * Store imported filaments in localStorage
     */
    private static storeImportedFilaments(filaments: FilamentData[]): void {
        LocalStorageService.saveFilaments(filaments);
    }

    /**
     * Validate project data structure
     */
    private static validateProjectData(data: any): data is ProjectData {
        return (
            data &&
            typeof data === 'object' &&
            typeof data.version === 'string' &&
            typeof data.name === 'string' &&
            typeof data.description === 'string' &&
            typeof data.createdAt === 'string' &&
            Array.isArray(data.filaments) &&
            typeof data.settings === 'object' &&
            data.settings !== null
        );
    }

    /**
     * Check if a file is a valid project file
     */
    static isValidProjectFile(file: File): boolean {
        return file.name.endsWith(this.FILE_EXTENSION) || file.type === 'application/json';
    }
} 