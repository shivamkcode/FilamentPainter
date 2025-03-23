import { updateImage } from "./UpdateImage.js";
import { config } from "../config/Config.js";
import { generateSTLAndDownload, getHeights } from "../tools/HeightmapExport.js";
const exportButtonSTL = document.getElementById('export-stl');
const detailSizeInput = document.getElementById('detail-size');
const imageResolutionX = document.getElementById('image-resolution-x');
const imageResolutionY = document.getElementById('image-resolution-y');
const physicalXInput = document.getElementById('physical-x');
const physicalYInput = document.getElementById('physical-y');
export function setupExport() {
    exportButtonSTL.addEventListener('click', (e) => {
        updateImage();
        if (config.paint.image.width == 0) {
            return;
        }
        let heights = getHeights(config.paint.computedResult, config.paint.image.width, config.paint.image.height);
        let pixelX = parseFloat(imageResolutionX.value);
        if (pixelX < 2) {
            return;
        }
        let pixelScaleFactor = pixelX / (pixelX - 1);
        let sizeScaleFactor = parseFloat(detailSizeInput.value);
        let scaleFactor = pixelScaleFactor * sizeScaleFactor;
        generateSTLAndDownload(heights, 'filamentPainting.stl', scaleFactor);
    });
}
