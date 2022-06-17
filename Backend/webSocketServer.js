const { createServer } = require("https");
const { readFileSync } = require("fs");
const { Server } = require("socket.io");

const WebSocketServer = require("ws");
const { getAllPixels } = require("./database");
const { place, clear } = require("./place");

const PORT = 8000;
const maxListerners = 20;

const httpsServer = createServer({
  key: readFileSync("./certificates/key.pem"),
  cert: readFileSync("./certificates/cert.pem"),
});
const io = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
});

// const webSocketServer = new WebSocketServer.Server({ port: PORT });
// webSocketServer.setMaxListeners(maxListerners);

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
      getAllPixels((err, rows) => {
        send(ws, "allPixels", { pixels: rows });
      });
      break;
    default:
      break;
  }
};

const placeAndBroadCast = (x, y, color, displayName) => {
  place(x, y, color, displayName) &&
    broadcast({ message: "place", payload: { x, y, color } });
};

const clearAndBroadCast = (x, y) => {
  clear(x, y) && broadcast({ message: "clear", payload: { x, y } });
};

const broadcast = (data) => {
  // console.log("emit", data);
  io.emit("message", data);
};

const send = (ws, message, data) => {
  ws.send({ message, payload: data });
};

const startWebSocketSever = () => {
  io.on("connection", (ws) => {
    console.log("New client connected.");

    send(ws, "welcome");

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

  httpsServer.listen(PORT, () => {
    console.log(`The WebSocket server is running on port ${PORT}.`);
  });
};

module.exports = { startWebSocketSever, placeAndBroadCast, clearAndBroadCast };
