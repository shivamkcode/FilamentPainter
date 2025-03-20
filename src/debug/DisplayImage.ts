function debugCreateImageFromOutputData(outputData: Float32Array, width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas 2D context not available.');
    }

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < outputData.length; i += 4) {
        data[i] = outputData[i] * 255;     // R
        data[i + 1] = outputData[i + 1] * 255; // G
        data[i + 2] = outputData[i + 2] * 255; // B
        data[i + 3] = 255;                   // A (always opaque)
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

// Example usage (assuming you have 'outputData', 'textureWidth', and 'textureHeight'):
export function debugDisplayDataOutput(outputData: Float32Array, textureWidth: number, textureHeight: number) {
    if (outputData) {
        const imageCanvas = debugCreateImageFromOutputData(outputData, textureWidth, textureHeight);
        document.body.appendChild(imageCanvas);
    }
}