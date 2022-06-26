import useP5 from "../Hooks/useP5";
import usePlace from "../Hooks/usePlace";
import StateContext from "./StateContext";

const StateProvider = ({ children }) => {
  const placeState = usePlace();
  const p5State = useP5(placeState.state.settings);
  const state = { placeState, p5State };
  return (
    <StateContext.Provider value={state}>{children}</StateContext.Provider>
  );
};

export default StateProvider;
