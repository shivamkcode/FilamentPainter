import {vec2} from "../Types.js";

export class PaintConfig {
    private _image: HTMLImageElement | null = null;

    public get image(): HTMLImageElement {
        if (this._image == null) {
            throw new Error('No image selected');
        }

        return this._image;
    }

    public set image(value: HTMLImageElement) {
        this._image = value;
    }

    public hasImage(): boolean {
        return this._image != null;
    }

    resolution: vec2 = vec2(0, 0);
    size: vec2 = vec2(0, 0);
}