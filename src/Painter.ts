import {config} from "./config/Config.js";
import {handleImageUpload} from "./Upload.js";
import {GLComputeHeights, GLComputeHeightsMode} from "./gl/compute/Heights.js";
import {GLImage} from "./gl/Image.js";
import {debugDisplayDataOutput, debugDisplayHTMLImage} from "./debug/DisplayImage.js";
import { setupDragAndDrop } from './ui/Filaments.js';

function initGL() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');

    if (!gl || !(gl instanceof WebGL2RenderingContext)) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        throw new Error("Cannot initialise WebGL.")
    } else {
        config.compute.gl = gl;
        config.compute.canvas = canvas;
    }

    // const ext1 = gl.getExtension('OES_texture_float');
    const extension = gl.getExtension('EXT_color_buffer_float');
    if (!extension) {
        throw new Error('Required extensions not supported');
    }
}

initGL();


let img = new Image();
img.onload = () => {
    let comp = new GLComputeHeights(GLComputeHeightsMode.NEAREST);

    let image = new GLImage(img);

    let result = comp.compute(image);

    console.log(result);

    debugDisplayDataOutput(result, image.width, image.height);
    debugDisplayHTMLImage(img);
}

img.src = "./test.jpg"
// img.src = "./white.png"


handleImageUpload('image-upload', (result) => {
    if (result.error) {
        console.error('Image upload error:', result.error);
    } else if (result.imageElement) {
        console.log('Image element:', result.imageElement);
        console.log('File:', result.file);

        // document.body.appendChild(result.imageElement); // for preview.
    }
});


setupDragAndDrop({
    listId: 'draggable-list',
    addItemButtonId: 'add-item-button',
    itemClassName: 'draggable-item',
    dragHandleClassName: 'drag-handle',
    newItemPrefix: 'Item'
});