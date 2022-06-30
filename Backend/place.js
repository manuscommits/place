const { insert, deletePixel } = require("./database.js");
const { isInteger } = require("./utils");

const xMax = 600;
const yMax = 300;

const coordsValidAndInRange = (x, y) => {
  return (
    isInteger(x) && isInteger(y) && x >= 0 && y >= 0 && x < xMax && y < yMax
  );
};

const place = (x, y, color, displayName) => {
  if (!coordsValidAndInRange(x, y) || !color || !displayName) return false;
  insert(x, y, color, displayName);
  return true;
};

const clear = (x, y) => {
  if (!coordsValidAndInRange(x, y)) return false;
  deletePixel(x, y);
  return true;
};

module.exports = { place, clear };
