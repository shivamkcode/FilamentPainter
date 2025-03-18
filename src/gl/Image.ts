import {config} from "../config/Config.js";

export class GLImage {
    private texture: WebGLTexture | null;
    private imageElement: HTMLImageElement | null;
    private width: number;
    private height: number;

    constructor(imageElement: HTMLImageElement) {
        this.imageElement = imageElement;
        this.width = imageElement.width;
        this.height = imageElement.height;
        this.texture = null;
        this.createTexture();
    }

    private createTexture(): void {
        if (!config.compute.gl || !this.imageElement) {
            return;
        }

        if (this.texture) {
            config.compute.gl.deleteTexture(this.texture);
        }

        this.texture = config.compute.gl.createTexture();
        config.compute.gl.bindTexture(config.compute.gl.TEXTURE_2D, this.texture);
        config.compute.gl.texImage2D(
            config.compute.gl.TEXTURE_2D,
            0,
            config.compute.gl.RGBA,
            config.compute.gl.RGBA,
            config.compute.gl.UNSIGNED_BYTE,
            this.imageElement
        );
        // Disable mipmaps:
        config.compute.gl.texParameteri(
            config.compute.gl.TEXTURE_2D,
            config.compute.gl.TEXTURE_MIN_FILTER,
            config.compute.gl.LINEAR // or gl.NEAREST
        );
        config.compute.gl.texParameteri(
            config.compute.gl.TEXTURE_2D,
            config.compute.gl.TEXTURE_MAG_FILTER,
            config.compute.gl.LINEAR // or gl.NEAREST
        );

        config.compute.gl.bindTexture(config.compute.gl.TEXTURE_2D, null);
    }

    getTexture(): WebGLTexture | null {
        return this.texture;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    dispose(): void {
        if (this.texture) {
            config.compute.gl.deleteTexture(this.texture);
            this.texture = null;
        }
        this.imageElement = null;
        this.width = 0;
        this.height = 0;
    }
}