import { xMaxPlace, yMaxPlace } from "../settings";

const isInteger = (number) => {
  const floor = Math.floor(number);
  return number - floor === 0;
};

const coordsValidAndInRange = (x, y) => {
  return (
    isInteger(x) && isInteger(y) && x >= 0 && y >= 0 && x < xMaxPlace && y < yMaxPlace
  );
};

export { isInteger, coordsValidAndInRange };
