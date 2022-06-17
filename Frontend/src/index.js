import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

window.addEventListener("contextmenu", (event) => event.preventDefault());
window.addEventListener(
  "auxclick",
  (event) => event.preventDefault()
);
