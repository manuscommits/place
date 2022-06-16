const tmiJs = require("tmi.js");
const { placeAndBroadCast, clearAndBroadCast } = require("./webSocketServer");

const channel = process.env.TWITCH_CHANNEL;
console.log("Listening to twitch channel " + channel + ".");

const messageCallback = (channel, tags, message, self) => {
  const displayName = tags["display-name"];
  handleCommand(displayName, message, self);
};

const handleCommand = (displayName, message, self) => {
  if (self) return;
  if (message.startsWith("!")) {
    const args = message.slice(1).split(" ");
    const command = args.shift().toLowerCase();
    console.log("TWITCH COMMAND RECVEIVED", displayName, command, args);
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
      arg0 && arg1 && arg2 && placeAndBroadCast(arg0, arg1, arg2, displayName);
      break;
    case "clear":
      arg0 && arg1 && clearAndBroadCast(arg0, arg1);
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
