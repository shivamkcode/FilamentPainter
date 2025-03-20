import {vec2} from "../Types.js";
import {Filament} from "../Filament.js";

export class PaintConfig {
    private _image: HTMLImageElement | null = null;
    private _filaments: Filament[] = [];

    get filaments(): Filament[] {
        return this._filaments;
    }

    set filaments(value: Filament[]) {
        this._filaments = value;
    }

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