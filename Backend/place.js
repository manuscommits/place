const { insert, deletePixel } = require("./database.js");
const { isInteger } = require("./utils");

const coordsValidAndInRange = (x, y) => {
  return (
    isInteger(x) && isInteger(y) && x >= 0 && y >= 0 && x <= 200 && y <= 200
  );
};

const place = (x, y, color, displayName) => {
  if (!coordsValidAndInRange(x, y) || !color || !displayName) return false;
  insert(x, y, color, displayName);
  return true;
};

const clear = (x, y) => {
  if (!coordsValidAndInRange(x, y) || !color || !displayName) return false;
  deletePixel(x, y);
  return true;
};

module.exports = { place, clear };
