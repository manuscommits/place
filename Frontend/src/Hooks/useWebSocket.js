import { useEffect } from "react";
import { webSocketUrl } from "../settings";

const webSocket = new WebSocket(webSocketUrl);

const useWebSocket = (onConncet, onMessage) => {
  useEffect(() => {
    webSocket.addEventListener("open", () => {
      onConncet();
      console.log("WebSocketClient connected.");
    });

    webSocket.addEventListener("message", (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        onMessage(jsonData);
      } catch (error) {
        console.log(error);
      }
    });
    // eslint-disable-next-line
  }, []);

  const send = (message, data) => {
    webSocket.send(JSON.stringify({ message, payload: data || {} }));
  };

  return { send };
};

export default useWebSocket;
