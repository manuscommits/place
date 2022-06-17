import Sketch from "react-p5";
import usePlace from "../Hooks/usePlace";
import { canvasHeight, canvasWidth, frameRate } from "../settings";
import {
  clearCanvas,
  drawGrid,
  mousePosition,
  placePixel
} from "../Utils/p5utils";
import Settings from "./Settings";

const setup = (p5, canvasParentRef) => {
  p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
  p5.noStroke();
  p5.frameRate(frameRate);
};

const Place = () => {
  // console.log("RENDER PLACE");
  const placeHook = usePlace();
  const { state, place, clear, setColor } = placeHook;
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
    const { xIndex, yIndex } = mousePosition(p5);
    const color = state.pixels[[xIndex, yIndex]];
    switch (p5.mouseButton) {
      case "left":
        place(xIndex, yIndex);
        break;
      case "right":
        clear(xIndex, yIndex);
        break;
      case "center":
        color && setColor(color);
        break;
      default:
        break;
    }
  };

  const mouseWheel = (p5) => {};

  return (
    <div>
      <Settings placeHook={placeHook} />
      <Sketch
        setup={setup}
        draw={draw}
        mousePressed={mousePressed}
        mouseWheel={mouseWheel}
      />
    </div>
  );
};

export default Place;
