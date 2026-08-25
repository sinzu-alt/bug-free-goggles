const wsfca = require("ws3-fca");
const chalk = require("chalk");
const config = require("./config.json");
const { loadAppState } = require("./login");
const { loadCommands } = require("./handle_command");
const { startListening } = require("./handle_listen");

console.log(chalk.magenta(`
 ███████╗██╗███╗   ██╗███████╗██╗   ██╗
 ██╔════╝██║████╗  ██║╚══███╔╝██║   ██║
 ███████╗██║██╔██╗ ██║  ███╔╝ ██║   ██║
 ╚════██║██║██║╚██╗██║ ███╔╝  ██║   ██║
 ███████║██║██║ ╚████║███████╗╚██████╔╝
 ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝
 ${config.botName} v${config.version} — prefix: "${config.prefix}"
`));

// Dashboard boots first and independently, so it stays reachable
// even if there's no appstate.json yet or login fails.
if (process.env.WITH_DASHBOARD !== "false") {
  require("./dashboard/server");
}

const appState = loadAppState();
const commands = loadCommands();

if (!appState) {
  console.log(chalk.yellow("[BOT] Skipping Facebook login — no appstate yet. Dashboard is still running so you can add one."));
} else {
  wsfca({ appState }, (err, api) => {
    if (err) {
      console.log(chalk.red("[LOGIN FAILED] " + JSON.stringify(err)));
      return;
    }

    api.setOptions({ listenEvents: true, selfListen: false });
    console.log(chalk.green(`[LOGIN OK] Logged in as UID ${api.getCurrentUserID()}`));

    startListening({ api, commands, config });
  });
        }const wsfca = require("ws3-fca");
const chalk = require("chalk");
const config = require("./config.json");
const { loadAppState } = require("./login");
const { loadCommands } = require("./handle_command");
const { startListening } = require("./handle_listen");

console.log(chalk.magenta(`
 ███████╗██╗███╗   ██╗███████╗██╗   ██╗
 ██╔════╝██║████╗  ██║╚══███╔╝██║   ██║
 ███████╗██║██╔██╗ ██║  ███╔╝ ██║   ██║
 ╚════██║██║██║╚██╗██║ ███╔╝  ██║   ██║
 ███████║██║██║ ╚████║███████╗╚██████╔╝
 ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝
 ${config.botName} v${config.version} — prefix: "${config.prefix}"
`));

// Dashboard boots first and independently, so it stays reachable
// even if there's no appstate.json yet or login fails.
if (process.env.WITH_DASHBOARD !== "false") {
  require("./dashboard/server");
}

const appState = loadAppState();
const commands = loadCommands();

if (!appState) {
  console.log(chalk.yellow("[BOT] Skipping Facebook login — no appstate yet. Dashboard is still running so you can add one."));
} else {
  wsfca({ appState }, (err, api) => {
    if (err) {
      console.log(chalk.red("[LOGIN FAILED] " + JSON.stringify(err)));
      return;
    }

    api.setOptions({ listenEvents: true, selfListen: false });
    console.log(chalk.green(`[LOGIN OK] Logged in as UID ${api.getCurrentUserID()}`));

    startListening({ api, commands, config });
  });
}
