const tmiJs = require("tmi.js");
const { place, clear } = require("./place.js");

const channel = process.env.TWITCH_CHANNEL;
console.log("Listening to twtich channel " + channel + ".");

const messageCallback = (channel, tags, message, self) => {
  const displayName = tags["display-name"];
  console.log("TWITCH MSG RECVEIVED", displayName, message);
  handleCommand(displayName, message, self);
};

const handleCommand = (displayName, message, self) => {
  if (self) return;
  if (message.startsWith("!")) {
    const args = message.slice(1).split(" ");
    const command = args.shift().toLowerCase();
    executeCommand(displayName, command, args);
  }
};

const executeCommand = (displayName, command, args) => {
  const arg0 = args[0];
  const arg1 = args[1];
  const arg2 = args[2];
  const arg3 = args[3];
  switch (command) {
    case "place":
      arg0 && arg1 && arg2 && place(arg0, arg1, arg2, displayName);
      break;
    case "clear":
      arg0 && arg1 && clear(arg0, arg1);
      break;
    default:
      break;
  }
};

const client = new tmiJs.Client({
  channels: [channel],
});
client.connect();
client.on("message", messageCallback);
