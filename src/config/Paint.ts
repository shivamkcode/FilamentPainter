import {vec2} from "../Types.js";
import {Filament} from "../Filament.js";

export enum HeightFunction {
    NEAREST,
    GREYSCALE_MAX,
    GREYSCALE_LUMINANCE
};


export class PaintConfig {
    private _image: HTMLImageElement | null = null;
    private _filaments: Filament[] = [];
    private _heightFunction: HeightFunction = HeightFunction.NEAREST;

    get heightFunction(): HeightFunction {
        return this._heightFunction;
    }

    set heightFunction(value: HeightFunction) {
        this._heightFunction = value;
    }

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
}