export class ComputeConfig {
    constructor() {
        this._gl = null;
    }
    get gl() {
        if (this._gl == null) {
            throw new Error('WebGL not supported on this browser');
        }
        return this._gl;
    }
    set gl(value) {
        this._gl = value;
    }
}
