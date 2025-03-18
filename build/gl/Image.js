import { config } from "../config/Config.js";
export class GLImage {
    constructor(imageElement) {
        this.imageElement = imageElement;
        this.width = imageElement.width;
        this.height = imageElement.height;
        this.texture = null;
        this.createTexture();
    }
    createTexture() {
        if (!config.compute.gl || !this.imageElement) {
            return;
        }
        if (this.texture) {
            config.compute.gl.deleteTexture(this.texture);
        }
        this.texture = config.compute.gl.createTexture();
        config.compute.gl.bindTexture(config.compute.gl.TEXTURE_2D, this.texture);
        config.compute.gl.texImage2D(config.compute.gl.TEXTURE_2D, 0, config.compute.gl.RGBA, config.compute.gl.RGBA, config.compute.gl.UNSIGNED_BYTE, this.imageElement);
        config.compute.gl.texParameteri(config.compute.gl.TEXTURE_2D, config.compute.gl.TEXTURE_MIN_FILTER, config.compute.gl.LINEAR);
        config.compute.gl.texParameteri(config.compute.gl.TEXTURE_2D, config.compute.gl.TEXTURE_MAG_FILTER, config.compute.gl.LINEAR);
        config.compute.gl.bindTexture(config.compute.gl.TEXTURE_2D, null);
    }
    getTexture() {
        return this.texture;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    dispose() {
        if (this.texture) {
            config.compute.gl.deleteTexture(this.texture);
            this.texture = null;
        }
        this.imageElement = null;
        this.width = 0;
        this.height = 0;
    }
}
