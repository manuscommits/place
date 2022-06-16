const WebSocketServer = require("ws");
const { getAllPixels } = require("./database");
const { place, clear } = require("./place");

const PORT = 8000;

const webSocketServer = new WebSocketServer.Server({ port: PORT });

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
  webSocketServer.clients.forEach((client) => {
    client.send(JSON.stringify(data));
  });
};

const send = (ws, message, data) => {
  ws.send(JSON.stringify({ message, payload: data }));
};

const startWebSocketSever = () => {
  webSocketServer.on("connection", (ws) => {
    console.log("New client connected.");
    ws.on("message", (data) => {
      try {
        const jsonData = JSON.parse(data);
        console.log("Message received:", jsonData);
        handleRequest(ws, jsonData);
      } catch (error) {
        console.log(error);
      }
    });
    ws.on("close", () => {
      console.log("The client has disconnected.");
    });
    ws.onerror = (event) => console.log(event.message);
  });
  console.log("The WebSocket server is running on port 8080");
};

module.exports = { startWebSocketSever, placeAndBroadCast, clearAndBroadCast };
