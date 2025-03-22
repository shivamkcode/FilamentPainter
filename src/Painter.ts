import {config} from "./config/Config.js";
import {handleImageUpload} from "./Upload.js";
import {getComputeFunction, GLComputeHeights} from "./gl/compute/Heights.js";
import {GLImage} from "./gl/Image.js";
import {debugDisplayDataOutput, debugDisplayHTMLImage} from "./debug/DisplayImage.js";
import {setupDragAndDrop} from './ui/Filaments.js';
import {setupHeightSelector} from "./ui/Heights.js";
import {HeightFunction} from "./config/Paint.js";
import {generateLargeHeightmap, generateSTLAndDownload, getHeights} from "./tools/HeightmapExport.js";

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

        // let heights = getHeights(result, image.width, image.height);
        // console.log(heights);
        //
        // generateSTLAndDownload(heights);

        // downloadSTL(stlString, `large_heightmap_scaled.stl`);
    });
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
}, (list: HTMLUListElement) => {
    console.log(list)
});

// ui/resize.ts

const previewWindow = document.querySelector<HTMLElement>('.preview-window');
const resizeHandle = document.querySelector<HTMLElement>('.resize-handle');

if (previewWindow && resizeHandle) {
    let isResizing = false;
    let startX: number;
    let startWidth: number;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = previewWindow.offsetWidth;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        e.preventDefault();
    });

    function handleMouseMove(e: MouseEvent) {
        if (!isResizing) return;
        let newWidth = startWidth + (e.clientX - startX);
        if (newWidth <= 200) {
            newWidth = 200;
        }
        // @ts-ignore
        previewWindow.style.width = `calc(${newWidth}px - 4rem)`;
        // @ts-ignore
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




// Example usage in a browser environment:
// const largeHeightmapData = generateLargeHeightmap(50, 50); // Generate a 50x50 heightmap
//
// // Example with a scaling factor of 2
// const scaleFactor = 0.5*(50/49);
// const stlString = generateSTL(largeHeightmapData, "large_heightmap_scaled.stl", scaleFactor);
//
// // Function to trigger a file download in the browser
// function downloadSTL(stlContent: string, filename: string) {
//     const blob = new Blob([stlContent], { type: 'application/vnd.ms-stlascii' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(link.href);
// }

// Trigger the download
// downloadSTL(stlString, `large_heightmap_scaled_${scaleFactor}x.stl`);
// console.log(`Large STL string with scaling factor of ${scaleFactor} initiated.`);