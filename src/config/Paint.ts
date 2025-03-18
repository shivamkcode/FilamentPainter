import {vec2} from "../Types.js";

export class PaintConfig {
    get image(): HTMLImageElement {
        if (this._image == null) {
            throw new Error('No image selected');
        }

        return this._image;
    }

    set image(value: HTMLImageElement) {
        this._image = value;
    }

    private _image: HTMLImageElement | null = null;

    hasImage(): boolean {
        return this._image != null;
    }

    resolution: vec2 = vec2(0, 0);
    size: vec2 = vec2(0, 0);
}