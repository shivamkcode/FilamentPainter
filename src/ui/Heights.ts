import {config} from "../config/Config.js";
import {HeightFunction} from "../config/Paint.js";

export function setupHeightSelector(callback: () => void) {
    const heightOptionSelection = document.getElementById('height-option-selection') as HTMLSelectElement;

    if (heightOptionSelection) {
        heightOptionSelection.addEventListener('change', (event: Event) => {
            const selectedValue = (event.target as HTMLSelectElement).value;

            switch (selectedValue) {
                case 'nearest':
                    config.paint.heightFunction = HeightFunction.NEAREST;
                    callback();
                    break;
                case 'greyscale-luminance':
                    config.paint.heightFunction = HeightFunction.GREYSCALE_LUMINANCE;
                    callback();
                    break;
                case 'greyscale-max':
                    config.paint.heightFunction = HeightFunction.GREYSCALE_MAX;
                    callback();
                    break;
                default:
                    console.error('Unknown selection');
            }
        });
    }
}