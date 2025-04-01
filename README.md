# Filament Painter

A free colour lithophane generator.

Powered by WebGL2.

## Running Locally

- Download as zip or clone the repository
- Drag `index.html` into a browser tab

## Directory Structure

- `/src` contains the Typescript source code
- `/ui` contains the CSS styling
- `/build` contains compiled JavaScript code (from Typescript)

## Core Components

The main component of this entire app is in https://github.com/hpnrep6/FilamentPainter/blob/master/src/gl/compute/Heights.ts

To determine the colour at a layer, a brute force method is used by starting from layer 0 and then incrementing the height for each layer while applying the appropriate colour blending function. 

Currently, the colour blending uses an exponential curve, which gives a pretty good approximation of how filament actually behaves. 

Since everything is run on the GPU, this brute force computation runs relatively fast.


### Possible Future Improvements

Currently, filament blending uses the RGB colour space and assumes that the translucency is modelled by (e^(-2x) - e^-2) / (1 - e^-2). This model may not be 100% accurate, and using a linaer colour space will allow for better linaer interpolation of colours. 
