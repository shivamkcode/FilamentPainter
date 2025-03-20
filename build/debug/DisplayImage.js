function debugCreateImageFromOutputData(outputData, width, height) {
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
        data[i] = outputData[i] * 255;
        data[i + 1] = outputData[i + 1] * 255;
        data[i + 2] = outputData[i + 2] * 255;
        data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}
export function debugDisplayDataOutput(outputData, textureWidth, textureHeight) {
    if (outputData) {
        const imageCanvas = debugCreateImageFromOutputData(outputData, textureWidth, textureHeight);
        document.body.appendChild(imageCanvas);
    }
}
