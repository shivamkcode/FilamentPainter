export class ComputeConfig {
    private _gl: WebGLRenderingContext | null = null; // Initialize to null or undefined
    private _canvas: HTMLCanvasElement | null = null;

    get canvas(): HTMLCanvasElement {
        if (this._canvas == null) {
            throw new Error('Fetched canvas before initialisation');
        }
        return this._canvas;
    }

    set canvas(value: HTMLCanvasElement) {
        this._canvas = value;
    }

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