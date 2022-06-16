import Sketch from "react-p5";
import {
  canvasHeight,
  canvasWidth,
  frameRate,
  size,
  yMaxPlace
} from "../settings";
import { clearCanvas, drawGrid, placePixel } from "../Utils/p5utils";
import usePlace from "../Hooks/usePlace";

const setup = (p5, canvasParentRef) => {
  p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  p5.noStroke();
  p5.frameRate(frameRate);
};

const Place = () => {
  console.log("RENDER PLACE");
  const { state, place, clear, setDisplayName, setColor } = usePlace();
  const { pixels, showGrid } = state;

  const draw = (p5) => {
    clearCanvas(p5);
    showGrid && drawGrid(p5);

    Object.entries(pixels).forEach(([indices, color]) => {
      const [xIndex, yIndex] = indices.split(",");
      placePixel(p5, xIndex, yIndex, color);
    });
  };

  const mousePressed = (p5) => {
    const xIndex = Math.floor(p5.mouseX / size);
    const yIndex = yMaxPlace - 1 - Math.floor(p5.mouseY / size);
    switch (p5.mouseButton) {
      case "left":
        console.log("place", xIndex, yIndex);
        place(xIndex, yIndex);
        break;
      case "right":
        console.log("clear", xIndex, yIndex);
        clear(xIndex, yIndex);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <input
        placeholder="username"
        onChange={(e) => setDisplayName(e.target.value)}
      ></input>
      <input
        placeholder="color"
        onChange={(e) => setColor(e.target.value)}
      ></input>
      <Sketch setup={setup} draw={draw} mousePressed={mousePressed} />
    </div>
  );
};

export default Place;
