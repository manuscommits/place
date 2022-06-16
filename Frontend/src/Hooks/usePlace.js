import { useState } from "react";
import { coordsValidAndInRange } from "../Utils/utils";
import useWebSocket from "./useWebSocket";

const usePlace = () => {
  const [state, setState] = useState({
    pixels: {},
    showGrid: true,
    displayName: "default",
    color: "black",
  });

  const onMessage = (data) => {
    const { message, payload } = data;
    console.log("Message received:", data);
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

  const loadAllPixels = () => {
    send("allPixels");
  };

  const { send } = useWebSocket(loadAllPixels, onMessage);

  const place = (x, y) => {
    const data = { x, y, color: state.color, displayName: state.displayName };
    coordsValidAndInRange(x, y) && send("place", data);
  };

  const clear = (x, y) => {
    const data = { x, y };
    send("clear", data);
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

  return { state, place, clear, setColor, setDisplayName, toggleGrid };
};

export default usePlace;
