import { useContext } from "react";
import StateContext from "../Components/StateContext";

const useStateContext = () => useContext(StateContext);

export default useStateContext;
