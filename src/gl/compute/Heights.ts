import {GLShader} from "../Shader.js";
import {GLProgram} from "../Program.js";
import {GLImage} from "../Image.js";

const fragmentShaderNearestMatch: string = ``;

const fragmentShaderTopographic: string = ``;

const fragmentShaderSource: string = `
#version 300 es

precision highp float;

uniform vec3 colours[/* Number of colours */];
uniform float heights[/* Number of colours */];
uniform float transmissionDistances[/* Number of colours */];
uniform sampler2D inputTexture;
uniform vec2 resolution;

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

    return blendedColor;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 resultColor = nearestColour(uv);
    fragColor = vec4(resultColor, 1.0);
}
`;

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = (a_position + 1.0) * 0.5; // Map [-1, 1] to [0, 1]
}
`;

export enum GLComputeHeightsMode {
    NEAREST,
    TOPOGRAPHIC
};

export class GLComputeHeights {
    vertexShader: GLShader;
    fragmentShader: GLShader;
    program: GLProgram;

    constructor(mode: GLComputeHeightsMode) {
        if (mode == GLComputeHeightsMode.NEAREST) {

        }

        this.vertexShader = new GLShader(3, "");
        this.fragmentShader = new GLShader(3, "");
        this.program = new GLProgram(this.vertexShader, this.fragmentShader);
    }

    compute(image: GLImage) {

    }
}