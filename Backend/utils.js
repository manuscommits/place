const isInteger = (number) => {
  const floor = Math.floor(number);
  return number - floor === 0;
};

module.exports = { isInteger };
