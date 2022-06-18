import "./App.css";
import Place from "./Components/Place";
import StateProvider from "./Components/StateProvider";

const App = () => {
  console.log("APP RENDER");

  return (
    <StateProvider>
      <div className="App">
        <Place />
      </div>
    </StateProvider>
  );
};

export default App;
