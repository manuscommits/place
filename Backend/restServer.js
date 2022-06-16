const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getAllPixels } = require("./database.js");
const { place, clear } = require("./place.js");

const HTTP_PORT = 8000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});

app.post("/place", (req, res, next) => {
  const { x, y, color, displayName } = req.body;
  place(x, y, color, displayName)
    ? res.json({ success: true })
    : res.json({ success: false });
});

app.post("/clear", (req, res, next) => {
  const { x, y, displayName } = req.body;
  clear(x, y, displayName)
    ? res.json({ success: true })
    : res.json({ success: false });
});

app.get("/allPixels", (req, res, next) => {
  getAllPixels((err, rows) => {
    !err
      ? res.json({ success: true, pixels: rows })
      : res.json({ success: false });
  });
});

// Default response for any other request
app.use((req, res) => {
  res.status(404);
});
