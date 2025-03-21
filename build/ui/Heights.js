import { config } from "../config/Config.js";
import { HeightFunction } from "../config/Paint.js";
export function setupHeightSelector(callback) {
    const heightOptionSelection = document.getElementById('height-option-selection');
    if (heightOptionSelection) {
        heightOptionSelection.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
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
