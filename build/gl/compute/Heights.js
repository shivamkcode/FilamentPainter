import { GLComputeEngine } from "./Engine.js";
import { config } from "../../config/Config.js";
function generateFragmentShader(heightFunction) {
    const fragmentShaderSource = `#version 300 es
precision highp float;

// Default maximum of 30 colour changes
// Can probably be increased slightly depending on WebGL hardware limitations
uniform vec3 colours[30];
uniform float heights[30];
uniform float opacities[30];
uniform vec3 heightRange;
uniform int numIndices;

uniform sampler2D inputTexture;
uniform vec2 resolution;

in vec2 v_texCoord;
out vec4 fragColor;

vec3 interpolateColours(vec3 colourA, vec3 colourB, float t, float opaqueness) {

    float amountInterpolated = t / opaqueness;
    if (amountInterpolated > 1.) {
        amountInterpolated = 1.;
    }
    
    return colourA + amountInterpolated * (colourB - colourA);
}

float getHeight(vec3 colour) {
    ${heightFunction}
    return height;
}

vec4 compute(vec2 uv) {
    vec4 inputColourRGBA = texture(inputTexture, uv);

    vec3 sourceColour = inputColourRGBA.rgb;
    
    float colourHeight = getHeight(sourceColour);
    
    vec3 currentColour = colours[0];
    vec3 previousColour = colours[0];
    float previousHeight = heightRange[0];
    float currentHeight = heightRange[0];
    int index = 0;
    
    for (int i = 0; i < 2000; i++) {
        currentHeight += heightRange[2];

        if (currentHeight > colourHeight) {
            break;
        }
        
        if (currentHeight < heightRange[0]) {
            continue;
        }
        

        if (currentHeight < heights[index]) {
            if (index == 0) {
                continue;
            }
        } else {
            index++;
            previousColour = currentColour;
            previousHeight = currentHeight;
            
            if (index >= numIndices) {
                break;
            }
        }
        
        currentColour = interpolateColours(previousColour, colours[index],  currentHeight - previousHeight, opacities[index]);
    }

    
    return vec4(currentColour, colourHeight);
}

void main() {
    vec4 resultColor = compute(v_texCoord);
    fragColor = vec4(resultColor);
}
`;
    return fragmentShaderSource;
}
const greyscaleMaxHeight = `
    float height = max(colour.r, max(colour.g, colour.b));
    height *= heightRange[1];
`;
const greyscaleLuminanceHeight = `
    float height = 0.299 * colour.r + 0.587 * colour.g + 0.114 * colour.b;
    height *= heightRange[1];
`;
const nearestMatchHieight = `
    vec3 currentColour = colours[0];
    vec3 previousColour = colours[0];
    float previousHeight = heightRange[0];
    float currentHeight = heightRange[0];
    int index = 0;
    
    float nearestHeight = 0.;
    float nearestColourDistance = 100000.0;
    
    for (int i = 0; i < 2000; i++) {
        currentHeight += heightRange[2];
        if (currentHeight < heightRange[0]) {
        
            if (distance(currentColour, colour) < nearestColourDistance) {
                nearestHeight = currentHeight;
                nearestColourDistance = distance(currentColour, colour);
            }
            continue;
        }
        
        if (currentHeight > heightRange[1]) {
            break;
        }

        if (currentHeight < heights[index]) {
            if (index == 0) {
                continue;
            }
        } else {
            index++;
            previousColour = currentColour;
            previousHeight = currentHeight;
            
            if (index >= numIndices) {
                break;
            }
        }
        
        currentColour = interpolateColours(previousColour, colours[index],  currentHeight - previousHeight, opacities[index]);
    
        if (distance(currentColour, colour) < nearestColourDistance) {
            nearestHeight = currentHeight;
            nearestColourDistance = distance(currentColour, colour);
        }
    }
    
    float height = nearestHeight;
`;
const vertexShaderSource = `#version 300 es
in vec2 a_position;
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = (a_position + 1.0) * 0.5;
}
`;
export var GLComputeHeightsMode;
(function (GLComputeHeightsMode) {
    GLComputeHeightsMode[GLComputeHeightsMode["NEAREST"] = 0] = "NEAREST";
    GLComputeHeightsMode[GLComputeHeightsMode["GREYSCALE_MAX"] = 1] = "GREYSCALE_MAX";
    GLComputeHeightsMode[GLComputeHeightsMode["GREYSCALE_LUMINANCE"] = 2] = "GREYSCALE_LUMINANCE";
})(GLComputeHeightsMode || (GLComputeHeightsMode = {}));
;
export class GLComputeHeights extends GLComputeEngine {
    constructor(mode) {
        if (mode == GLComputeHeightsMode.NEAREST) {
            super(vertexShaderSource, generateFragmentShader(nearestMatchHieight));
        }
        else if (mode == GLComputeHeightsMode.GREYSCALE_MAX) {
            super(vertexShaderSource, generateFragmentShader(greyscaleMaxHeight));
        }
        else {
            super(vertexShaderSource, generateFragmentShader(greyscaleLuminanceHeight));
        }
    }
    uploadComputeData(colours, heights, opacities, heightRange, image) {
        let gl = config.compute.gl;
        let program = this.program.program;
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        this.setUniform3fv("colours", colours);
        this.setUniform1fv("heights", heights);
        this.setUniform1fv("opacities", opacities);
        this.setUniform3f("heightRange", heightRange[0], heightRange[1], heightRange[2]);
        this.setUniform1i("numIndices", heights.length);
        const inputTextureLocation = gl.getUniformLocation(program, "inputTexture");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, image.texture);
        gl.uniform1i(inputTextureLocation, 0);
    }
    compute(image) {
        let gl = config.compute.gl;
        let program = this.program.program;
        gl.useProgram(program);
        const textureWidth = image.width;
        const textureHeight = image.height;
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        const outputTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, outputTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, textureWidth, textureHeight, 0, gl.RGBA, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, outputTexture, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
            throw new Error("Framebuffer is not complete.");
        }
        const colours = [
            1.0, 1.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0
        ];
        const heights = [0.8, 1.4, 1.9, 2.5, 2.6];
        const opacities = [0.5, 0.5, 0.5, 0.5, 0.5];
        const heightRange = [0.2, 2.6, 0.05];
        this.uploadComputeData(colours, heights, opacities, heightRange, image);
        gl.viewport(0, 0, textureWidth, textureHeight);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        const outputData = new Float32Array(textureWidth * textureHeight * 4);
        gl.readPixels(0, 0, textureWidth, textureHeight, gl.RGBA, gl.FLOAT, outputData);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.deleteFramebuffer(framebuffer);
        gl.deleteTexture(outputTexture);
        return outputData;
    }
    setUniform1i(name, a) {
        const location = config.compute.gl.getUniformLocation(this.program.program, name);
        if (location !== null) {
            config.compute.gl.uniform1i(location, a);
        }
        else {
            console.log(`Uniform '${name}' not found, skipping.`);
        }
    }
    setUniform3f(name, a, b, c) {
        const location = config.compute.gl.getUniformLocation(this.program.program, name);
        if (location !== null) {
            config.compute.gl.uniform3f(location, a, b, c);
        }
        else {
            console.log(`Uniform '${name}' not found, skipping.`);
        }
    }
    setUniform1fv(name, value) {
        const location = config.compute.gl.getUniformLocation(this.program.program, name);
        if (location !== null) {
            config.compute.gl.uniform1fv(location, value);
        }
        else {
            console.log(`Uniform '${name}' not found, skipping.`);
        }
    }
    setUniform2fv(name, value) {
        const location = config.compute.gl.getUniformLocation(this.program.program, name);
        if (location !== null) {
            config.compute.gl.uniform2fv(location, value);
        }
        else {
            console.log(`Uniform '${name}' not found, skipping.`);
        }
    }
    setUniform3fv(name, value) {
        const location = config.compute.gl.getUniformLocation(this.program.program, name);
        if (location !== null) {
            config.compute.gl.uniform3fv(location, value);
        }
        else {
            console.log(`Uniform '${name}' not found, skipping.`);
        }
    }
    setUniform4fv(name, value) {
        const location = config.compute.gl.getUniformLocation(this.program.program, name);
        if (location !== null) {
            config.compute.gl.uniform4fv(location, value);
        }
        else {
            console.log(`Uniform '${name}' not found, skipping.`);
        }
    }
}
