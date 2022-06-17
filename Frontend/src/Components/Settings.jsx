import { Switch, TextField } from "@mui/material";

const Settings = ({ placeHook }) => {
  const { state, setDisplayName, setColor, toggleGrid } =
    placeHook;
  return (
    <>
      <TextField
        label="username"
        color="secondary"
        value={state.displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />
      <TextField
        label="color"
        color="secondary"
        value={state.color}
        onChange={(event) => setColor(event.target.value)}
      />
      <Switch defaultChecked onChange={toggleGrid} />
    </>
  );
};

export default Settings;
