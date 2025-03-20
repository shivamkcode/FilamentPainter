import { vec2 } from "../Types.js";
export class PaintConfig {
    constructor() {
        this._image = null;
        this._filaments = [];
        this.resolution = vec2(0, 0);
        this.size = vec2(0, 0);
    }
    get filaments() {
        return this._filaments;
    }
    set filaments(value) {
        this._filaments = value;
    }
    get image() {
        if (this._image == null) {
            throw new Error('No image selected');
        }
        return this._image;
    }
    set image(value) {
        this._image = value;
    }
    hasImage() {
        return this._image != null;
    }
}
