import { config } from "./config/Config.js";
import { handleImageUpload } from "./Upload.js";
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
}
initGL();
handleImageUpload('image-upload', (result) => {
    if (result.error) {
        console.error('Image upload error:', result.error);
    }
    else if (result.imageElement) {
        console.log('Image element:', result.imageElement);
        console.log('File:', result.file);
        document.body.appendChild(result.imageElement);
    }
});
