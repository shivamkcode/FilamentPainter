import { FilamentData } from "../ui/Filaments.js";

const STORAGE_KEY = 'filamentPainter_data';

export interface SavedFilamentData {
    filaments: FilamentData[];
    lastSaved: number;
}

export class LocalStorageService {
    /**
     * Save filament data to localStorage
     */
    static saveFilaments(filaments: FilamentData[]): void {
        try {
            const data: SavedFilamentData = {
                filaments: filaments,
                lastSaved: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('Filaments saved to localStorage:', filaments.length, 'filaments');
        } catch (error) {
            console.error('Error saving filaments to localStorage:', error);
        }
    }

    /**
     * Load filament data from localStorage
     */
    static loadFilaments(): FilamentData[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: SavedFilamentData = JSON.parse(stored);
                console.log('Filaments loaded from localStorage:', data.filaments.length, 'filaments');
                return data.filaments;
            }
        } catch (error) {
            console.error('Error loading filaments from localStorage:', error);
        }
        return [];
    }

    /**
     * Clear all saved filament data
     */
    static clearFilaments(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('Filament data cleared from localStorage');
        } catch (error) {
            console.error('Error clearing filaments from localStorage:', error);
        }
    }

    /**
     * Check if there are saved filaments
     */
    static hasSavedFilaments(): boolean {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: SavedFilamentData = JSON.parse(stored);
                return data.filaments && data.filaments.length > 0;
            }
        } catch (error) {
            console.error('Error checking saved filaments:', error);
        }
        return false;
    }

    /**
     * Get the last saved timestamp
     */
    static getLastSavedTime(): number | null {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: SavedFilamentData = JSON.parse(stored);
                return data.lastSaved;
            }
        } catch (error) {
            console.error('Error getting last saved time:', error);
        }
        return null;
    }
} 