import { useState } from "react";
import { frameRate } from "../settings";

const useP5 = (settings) => {
  const [state, setState] = useState({ p5: undefined, colorPicker: undefined });
  const { canvasWidth, canvasHeight } = settings;

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.noStroke();
    p5.frameRate(frameRate);
    // const colorPicker = p5.createColorPicker();
    // colorPicker.position(100, 100);
    // p5.noLoop();
    setState((previousState) => ({ ...previousState, p5 }));
  };

  const redraw = () => {
    state.p5 && state.p5.redraw();
  };

  return { setup, redraw };
};

export default useP5;
