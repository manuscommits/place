import { useState } from "react";
import {
  canvasHeight,
  canvasWidth,
  size,
  xMaxPlace,
  yMaxPlace
} from "../settings";
import { isInteger } from "../Utils/utils";
import useWebSocket from "./useWebSocket";

const usePlace = () => {
  const [state, setState] = useState({
    pixels: {},
    settings: { size, xMaxPlace, yMaxPlace, canvasWidth, canvasHeight },
    showGrid: true,
    displayName: "default",
    color: "black",
  });

  const onMessage = (data) => {
    console.log("Message received:", data);
    const { message, payload } = data;
    const { x, y, color, pixels } = payload || {};
    switch (message) {
      case "place":
        transformPixels((pixels) => {
          pixels[[x, y]] = color;
        });
        break;
      case "clear":
        transformPixels((pixels) => {
          delete pixels[[x, y]];
        });
        break;
      case "allPixels":
        transformPixels((prevPixels) => {
          pixels.forEach(({ x, y, color }) => {
            prevPixels[[x, y]] = color;
          });
        });
        break;
      default:
        break;
    }
  };

  const transformPixels = (transformation) => {
    setState((previousState) => {
      const pixels = { ...previousState.pixels };
      transformation(pixels);
      return { ...previousState, pixels };
    });
  };

  const { send } = useWebSocket(onMessage);

  const coordsValidAndInRange = (x, y) => {
    return (
      isInteger(x) &&
      isInteger(y) &&
      x >= 0 &&
      y >= 0 &&
      x < state.settings.xMaxPlace &&
      y < state.settings.yMaxPlace
    );
  };

  const place = (x, y) => {
    const data = { x, y, color: state.color, displayName: state.displayName };
    coordsValidAndInRange(x, y) && send("place", data);
  };

  const clear = (x, y) => {
    const data = { x, y };
    coordsValidAndInRange(x, y) && send("clear", data);
  };

  const setDisplayName = (displayName) => {
    setState((previousState) => ({ ...previousState, displayName }));
  };

  const setColor = (color) => {
    setState((previousState) => ({ ...previousState, color }));
  };

  const toggleGrid = () => {
    setState((previousState) => ({
      ...previousState,
      showGrid: !previousState.showGrid,
    }));
  };

  const increaseSize = () => {
    setState((previousState) => {
      const size = previousState.settings.size + 1;
      const canvasWidth = previousState.settings.xMaxPlace * size;
      const canvasHeight = previousState.settings.yMaxPlace * size;
      return {
        ...previousState,
        settings: {
          ...previousState.settings,
          size,
          canvasWidth,
          canvasHeight,
        },
      };
    });
  };

  const decreaseSize = () => {
    setState((previousState) => {
      const size = Math.max(previousState.settings.size - 1, 1);
      const canvasWidth = previousState.settings.xMaxPlace * size;
      const canvasHeight = previousState.settings.yMaxPlace * size;
      return {
        ...previousState,
        settings: {
          ...previousState.settings,
          size,
          canvasWidth,
          canvasHeight,
        },
      };
    });
  };

  return {
    state,
    place,
    clear,
    setColor,
    setDisplayName,
    toggleGrid,
    increaseSize,
    decreaseSize,
  };
};

export default usePlace;
