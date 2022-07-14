import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
// import { webSocketUrl } from "./settings";
// window.location.href = "http://" + webSocketUrl.slice(5);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

window.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener("auxclick", (event) => event.preventDefault());
