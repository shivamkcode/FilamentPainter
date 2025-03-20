import {GLShader} from "../Shader.js";
import {GLProgram} from "../Program.js";
import {GLImage} from "../Image.js";
import {GLComputeEngine} from "./Engine.js";
import {PaintConfig} from "../../config/Paint.js";
import {config} from "../../config/Config.js";

// Vertex Shader (WebGL 2)
const vertexShaderSource = `#version 300 es
in vec2 a_position;
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = (a_position + 1.0) * 0.5;
}
`;

// Fragment Shader (WebGL 2)
const fragmentShaderSource = `#version 300 es
precision highp float;

// Default maximum of 30 colour changes
// Can probably be increased slightly depending on WebGL hardware limitations
uniform vec3 colours[30];
uniform float heights[30];
uniform float transmissionDistances[30];
uniform sampler2D inputTexture;
uniform vec2 resolution;

in vec2 v_texCoord;
out vec4 fragColor;

float linearstep(float edge0, float edge1, float x) {
    return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
}

vec3 nearestColour(vec2 uv) {
    vec4 inputColor = texture(inputTexture, uv);

    vec3 targetColor = inputColor.rgb;

    float h = 0.0;
    vec3 blendedColor = vec3(0.0);
    float lastHeight = 0.0;

    for (int i = 0; i < colours.length(); ++i) {
        float currentHeight = heights[i];
        float transmissionDistance = transmissionDistances[i];
        vec3 currentColor = colours[i];

        if (h >= currentHeight) {
            float blendFactor = linearstep(lastHeight, currentHeight + transmissionDistance, h);
            blendFactor = clamp(blendFactor, 0.0, 1.0);
            blendedColor = mix(blendedColor, currentColor, blendFactor);
        } else {
            float blendFactor = linearstep(lastHeight, currentHeight + transmissionDistance, h);
            blendFactor = clamp(blendFactor, 0.0, 1.0);
            if(i==0){
                blendedColor = mix(vec3(0.0), currentColor, blendFactor);
            }
            else{
                blendedColor = mix(blendedColor, currentColor, blendFactor);
            }
        }
        lastHeight = currentHeight;
        h += 0.08;
    }

    return vec3(targetColor.r, targetColor.g, targetColor.b);
    // return blendedColor + vec3(inputColor.r, 1., 1.);
}

void main() {
    vec3 resultColor = nearestColour(v_texCoord);
    fragColor = vec4(resultColor, 1.0);
}
`;

export enum GLComputeHeightsMode {
    NEAREST,
    TOPOGRAPHIC
};

export class GLComputeHeights extends GLComputeEngine {
    constructor(mode: GLComputeHeightsMode) {
        if (mode == GLComputeHeightsMode.NEAREST) {

        }

        super(vertexShaderSource, fragmentShaderSource);
    }

     uploadComputeData(
        colours: number[],
        heights: number[],
        transmissionDistances: number[],
        image: GLImage
    ) {
        let gl = config.compute.gl;
        let program = this.program.program;

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const coloursLocation = gl.getUniformLocation(program, "colours");
        const heightsLocation = gl.getUniformLocation(program, "heights");
        const transmissionDistancesLocation = gl.getUniformLocation(program, "transmissionDistances");
        const inputTextureLocation = gl.getUniformLocation(program, "inputTexture");

        if (!coloursLocation || !heightsLocation || !transmissionDistancesLocation || !inputTextureLocation) {
            throw new Error("Uniform locations not found");
        }

        gl.uniform3fv(coloursLocation, colours);
        gl.uniform1fv(heightsLocation, heights);
        gl.uniform1fv(transmissionDistancesLocation, transmissionDistances);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, image.texture);
        gl.uniform1i(inputTextureLocation, 0);
    }

    compute(image: GLImage) {
        let gl = config.compute.gl;
        let program = this.program.program;

        gl.useProgram(program);

        const colours = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 1.0, 0.0,
        ];
        const heights = [0.0, 0.3, 0.6, 0.9];
        const transmissionDistances = [0.1, 0.1, 0.1, 0.1];
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

        this.uploadComputeData(
            colours,
            heights,
            transmissionDistances,
            image
        );

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
}