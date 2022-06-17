import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import { webSocketUrl } from "../settings";

const ioSocket = new socketIOClient(webSocketUrl);

const useWebSocket = (onMessage) => {
  useEffect(() => {
    ioSocket.on("open", () => {
      // geht nicht?
      console.log("WebSocketClient connected.");
    });

    ioSocket.on("message", (data) => {
      try {
        onMessage(data);
      } catch (error) {
        console.log(error);
      }
    });
    // eslint-disable-next-line
  }, []);

  const send = (message, data) => {
    console.log("Send message:", message, data);
    ioSocket.send(JSON.stringify({ message, payload: data || {} }));
  };

  return { send };
};

export default useWebSocket;
