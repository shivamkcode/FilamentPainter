const STORAGE_KEY = 'filamentPainter_data';
export class LocalStorageService {
    static saveFilaments(filaments) {
        try {
            const data = {
                filaments: filaments,
                lastSaved: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            console.log('Filaments saved to localStorage:', filaments.length, 'filaments');
        }
        catch (error) {
            console.error('Error saving filaments to localStorage:', error);
        }
    }
    static loadFilaments() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                console.log('Filaments loaded from localStorage:', data.filaments.length, 'filaments');
                return data.filaments;
            }
        }
        catch (error) {
            console.error('Error loading filaments from localStorage:', error);
        }
        return [];
    }
    static clearFilaments() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('Filament data cleared from localStorage');
        }
        catch (error) {
            console.error('Error clearing filaments from localStorage:', error);
        }
    }
    static hasSavedFilaments() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                return data.filaments && data.filaments.length > 0;
            }
        }
        catch (error) {
            console.error('Error checking saved filaments:', error);
        }
        return false;
    }
    static getLastSavedTime() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                return data.lastSaved;
            }
        }
        catch (error) {
            console.error('Error getting last saved time:', error);
        }
        return null;
    }
}
