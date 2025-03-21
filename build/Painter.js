import { config } from "./config/Config.js";
import { handleImageUpload } from "./Upload.js";
import { getComputeFunction, GLComputeHeights } from "./gl/compute/Heights.js";
import { GLImage } from "./gl/Image.js";
import { debugDisplayDataOutput, debugDisplayHTMLImage } from "./debug/DisplayImage.js";
import { setupDragAndDrop } from './ui/Filaments.js';
import { setupHeightSelector } from "./ui/Heights.js";
import { HeightFunction } from "./config/Paint.js";
import { generateSTLAndDownload, getHeights } from "./tools/HeightmapExport.js";
function initGL() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
    if (!gl || !(gl instanceof WebGL2RenderingContext)) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        throw new Error("Cannot initialise WebGL.");
    }
    else {
        config.compute.gl = gl;
        config.compute.canvas = canvas;
    }
    const extension = gl.getExtension('EXT_color_buffer_float');
    if (!extension) {
        throw new Error('Required extensions not supported');
    }
}
initGL();
let img = new Image();
img.onload = () => {
    let comp = new GLComputeHeights(HeightFunction.NEAREST);
    let image = new GLImage(img);
    let result = comp.compute(image);
    debugDisplayDataOutput(result, image.width, image.height);
    debugDisplayHTMLImage(img);
    setupHeightSelector(() => {
        let comp = getComputeFunction(config.paint.heightFunction);
        let result = comp.compute(image);
        debugDisplayDataOutput(result, image.width, image.height);
        debugDisplayHTMLImage(img);
        let heights = getHeights(result, image.width, image.height);
        console.log(heights);
        generateSTLAndDownload(heights);
    });
};
img.src = "./test.jpg";
handleImageUpload('image-upload', (result) => {
    if (result.error) {
        console.error('Image upload error:', result.error);
    }
    else if (result.imageElement) {
        console.log('Image element:', result.imageElement);
        console.log('File:', result.file);
    }
});
setupDragAndDrop({
    listId: 'draggable-list',
    addItemButtonId: 'add-item-button',
    itemClassName: 'draggable-item',
    dragHandleClassName: 'drag-handle',
    newItemPrefix: 'Item'
}, (list) => {
    console.log(list);
});
const previewWindow = document.querySelector('.preview-window');
const resizeHandle = document.querySelector('.resize-handle');
if (previewWindow && resizeHandle) {
    let isResizing = false;
    let startX;
    let startWidth;
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = previewWindow.offsetWidth;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
    });
    function handleMouseMove(e) {
        if (!isResizing)
            return;
        let newWidth = startWidth + (e.clientX - startX);
        if (newWidth <= 200) {
            newWidth = 200;
        }
        previewWindow.style.width = `calc(${newWidth}px - 4rem)`;
        resizeHandle.style.right = '0px';
    }
    function handleMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    previewWindow.style.width = `50vw`;
    window.addEventListener('resize', () => {
        previewWindow.style.width = `50vw`;
    });
}
