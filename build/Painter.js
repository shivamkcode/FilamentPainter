import { handleImageUpload } from "./Upload.js";
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
