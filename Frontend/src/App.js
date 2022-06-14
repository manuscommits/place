import React from "react";
import "./App.css";
import Place from "./Components/Place";

const App = () => {
  console.log("APP RENDER");

  return (
    <div>
      <Place />
    </div>
  );
};

export default App;
