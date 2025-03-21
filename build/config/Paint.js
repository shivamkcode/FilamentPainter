export var HeightFunction;
(function (HeightFunction) {
    HeightFunction[HeightFunction["NEAREST"] = 0] = "NEAREST";
    HeightFunction[HeightFunction["GREYSCALE_MAX"] = 1] = "GREYSCALE_MAX";
    HeightFunction[HeightFunction["GREYSCALE_LUMINANCE"] = 2] = "GREYSCALE_LUMINANCE";
})(HeightFunction || (HeightFunction = {}));
;
export class PaintConfig {
    constructor() {
        this._image = null;
        this._filaments = [];
        this._heightFunction = HeightFunction.NEAREST;
    }
    get heightFunction() {
        return this._heightFunction;
    }
    set heightFunction(value) {
        this._heightFunction = value;
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
