const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getAllPixels } = require("./database.js");
const { place, clear } = require("./place.js");
require("./twitchIntegration.js");

const HTTP_PORT = 3000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

app.get("/place", (req, res, next) => {
  const { x, y, color, displayName } = req.body;
  place(x, y, color, displayName)
    ? res.json({
        message: `Pixel placed on x=${x}, y=${y} with color ${color} by ${displayName}.`,
      })
    : res.json({
        message: `Pixel placing failed on x=${x}, y=${y} with color ${color} by ${displayName}.`,
      });
});

app.get("/clear", (req, res, next) => {
  const { x, y, displayName } = req.body;
  clear(x, y, color, displayName)
    ? res.json({
        message: `Pixel cleared on x=${x}, y=${y} by ${displayName}.`,
      })
    : res.json({
        message: `Pixel placing failed on x=${x}, y=${y} with color ${color} by ${displayName}.`,
      });
});

app.get("/allPixels", (req, res, next) => {
  getAllPixels((err, rows) => {
    res.json({ allPixels: rows });
  });
});

app.get("/", (req, res, next) => {
  res.json({ message: "A shoot in the void." });
});

// Default response for any other request
app.use((req, res) => {
  res.status(404);
});
