import React from "react";
import Sketch from "react-p5";

const frameRate = 1;

const size = 10;
const xMaxPlace = 100;
const yMaxPlace = 100;

const canvasWidth = size * xMaxPlace;
const canvasHeight = size * yMaxPlace;

const lightLine = 100;
const mediumLine = 50;
const strongLine = 0;

const setup = (p5, canvasParentRef) => {
  p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  p5.noStroke();
  p5.frameRate(frameRate);
};

const clearCanvas = (p5) => {
  p5.erase();
  p5.rect(0, 0, canvasWidth, canvasHeight);
  p5.noErase();
};

const drawGrid = (p5) => {
  p5.noFill();
  p5.background(255);
  p5.rect(0, 0, canvasWidth, canvasHeight);
  p5.stroke(lightLine);
  for (var x = 0; x <= xMaxPlace; ++x) {
    if (x % 5 === 0) p5.stroke(mediumLine);
    if (x % 10 === 0) p5.stroke(strongLine);
    p5.line(size * x, 0, size * x, canvasHeight);
    p5.stroke(lightLine);
  }
  for (var y = 0; y <= yMaxPlace; ++y) {
    if (y % 5 === 0) p5.stroke(mediumLine);
    if (y % 10 === 0) p5.stroke(strongLine);
    p5.line(0, size * y, canvasWidth, size * y);
    p5.stroke(lightLine);
  }
  p5.noStroke();
};

const placePixel = (p5, xIndex, yIndex, color) => {
  p5.fill(color);
  p5.square(size * xIndex, size * (yMaxPlace - 1 - yIndex), size);
};

const Place = () => {
  console.log("RENDER PLACE");
  const { pixels, showGrid } = { pixels: {}, showGrid: true };
  const draw = (p5) => {
    // NOTE: Do not use setState in the draw function or in functions that are executed
    clearCanvas(p5);
    showGrid && drawGrid(p5);

    Object.entries(pixels).forEach(([indices, color]) => {
      const [xIndex, yIndex] = indices.split(",");
      placePixel(p5, xIndex, yIndex, color);
    });
  };

  const mousePressed = (p5) => {
    console.log("coords", p5.mouseX, p5.mouseY);
  };

  return (
    <div>
      <Sketch setup={setup} draw={draw} mousePressed={mousePressed} />
    </div>
  );
};

export default Place;
