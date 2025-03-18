export class ComputeConfig {
    private _gl: WebGLRenderingContext | null = null; // Initialize to null or undefined

    get gl(): WebGLRenderingContext {
        if (this._gl == null) {
            throw new Error('WebGL not supported on this browser');
        }
        return this._gl;
    }

    set gl(value: WebGLRenderingContext) {
        this._gl = value;
    }
}