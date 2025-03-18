import {getOpacity} from "./tools/AutoOpacity.js";
import {config} from "./config/Config.js";
import {handleImageUpload} from "./Upload.js";

handleImageUpload('image-upload', (result) => {
    if (result.error) {
        console.error('Image upload error:', result.error);
    } else if (result.imageElement) {
        console.log('Image element:', result.imageElement);
        console.log('File:', result.file);

        // Use the imageElement for WebGL or other purposes:
        // Example: Create a texture from the imageElement (WebGL context assumed)
        /*
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, result.imageElement);
        gl.generateMipmap(gl.TEXTURE_2D);
        // ... use the texture ...
        */

        document.body.appendChild(result.imageElement); // for preview.
    }
});