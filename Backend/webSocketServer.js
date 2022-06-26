const { createServer: createHttpsServer } = require("https");
const { createServer: createHttpServer } = require("http");
const express = require("express");
const path = require("path");
const { readFileSync, readFile, writeFile } = require("fs");
const { Server } = require("socket.io");
const { getAllPixels } = require("./database");
const { place, clear } = require("./place");

const PORT = 8000;
const maxListerners = 10;
const httpsEnabled = false;

const app = express();
const pathToFrontendBuild = path.join(__dirname, "../frontend/build");
const pathIndexHtml = path.join(__dirname, "../frontend/build/index.html");
readFile(pathIndexHtml, (err, data) => {
  if (err) throw err;
  // replace "/place" with "."
  const modifiedData = data.toString().replaceAll("/place", ".");
  writeFile(pathIndexHtml, modifiedData, (err) => {
    if (err) throw err;
    app.use(express.static(pathToFrontendBuild));
    console.log("Frontend ready.");
  });
});

const server = httpsEnabled
  ? createHttpsServer(
      {
        key: readFileSync("./certificates/key.pem"),
        cert: readFileSync("./certificates/cert.pem"),
      },
      app
    )
  : createHttpServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.setMaxListeners(maxListerners);

const handleRequest = (ws, data) => {
  const { message, payload } = data;
  const { x, y, color, displayName } = payload || {};
  switch (message) {
    case "place":
      placeAndBroadCast(x, y, color, displayName);
      break;
    case "clear":
      clearAndBroadCast(x, y);
      break;
    case "allPixels":
      sendAllPixels(ws);
      break;
    default:
      break;
  }
};

const sendAllPixels = (ws) => {
  getAllPixels((err, rows) => {
    const pixels = rows.map(({ x, y, color }) => ({ x, y, color }));
    send(ws, "allPixels", { pixels });
  });
};

const placeAndBroadCast = (x, y, color, displayName) => {
  place(x, y, color, displayName) &&
    broadcast({ message: "place", payload: { x, y, color } });
};

const clearAndBroadCast = (x, y) => {
  clear(x, y) && broadcast({ message: "clear", payload: { x, y } });
};

const broadcast = (data) => {
  io.emit("message", data);
};

const send = (ws, message, data) => {
  ws.send({ message, payload: data });
};

const startWebSocketSever = () => {
  io.on("connection", (ws) => {
    console.log("New client connected.");

    sendAllPixels(ws);

    ws.on("message", (data) => {
      try {
        const jsonData = JSON.parse(data);
        console.log("Message received:", jsonData);
        handleRequest(ws, jsonData);
      } catch (error) {
        console.log(error);
      }
    });
    ws.on("disconnect", () => {
      console.log("Client disconnected.");
    });
    ws.on("close", () => {
      console.log("Connection closed.");
    });
    ws.onerror = (event) => console.log(event.message);
  });

  server.listen(PORT, () => {
    console.log(`The WebSocket server is running on port ${PORT}.`);
  });
};

module.exports = { startWebSocketSever, placeAndBroadCast, clearAndBroadCast };
