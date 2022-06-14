import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Place from "./Components/Place";

const App = () => {
  console.log("APP RENDER");

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Place} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
