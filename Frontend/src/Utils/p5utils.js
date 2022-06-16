import { canvasHeight, canvasWidth, lightLine, mediumLine, size, strongLine, xMaxPlace, yMaxPlace } from "../settings";

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

export { clearCanvas, drawGrid, placePixel };
