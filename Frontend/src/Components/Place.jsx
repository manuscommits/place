import Sketch from "react-p5";
import useStateContext from "../Hooks/useStateContext";
import {
  clearCanvas,
  drawGrid,
  mousePosition,
  placePixel
} from "../Utils/p5utils";
import Settings from "./Settings";

const Place = () => {
  // console.log("RENDER PLACE");
  const { placeState, p5State } = useStateContext();
  const { state, place, clear, setColor } = placeState;
  const { pixels, showGrid } = state;
  const { setup } = p5State;

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
    const mouseButton = p5.mouseButton;
    const leftShiftPressed = p5.keyIsDown(16);
    switch (mouseButton) {
      case "left":
        if (leftShiftPressed) setColor(color);
        else place(xIndex, yIndex);
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
      <Settings placeHook={placeState} />
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
