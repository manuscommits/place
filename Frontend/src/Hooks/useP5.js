import { useState } from "react";
import { canvasHeight, canvasWidth, frameRate } from "../settings";

const useP5 = () => {
  const [state, setState] = useState({ p5: undefined });

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef);
    p5.noStroke();
    p5.frameRate(frameRate);
    // p5.noLoop();
    setState((previousState) => ({ ...previousState, p5 }));
  };

  const redraw = () => {
    state.p5 && state.p5.redraw();
  }

  return { setup, redraw };
};

export default useP5;
