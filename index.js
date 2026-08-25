const wsfca = require("ws3-fca");
const chalk = require("chalk");
const config = require("./config.json");
const { loadAppState } = require("./login");
const { loadCommands, handleCommand } = require("./handle_command");

console.log(chalk.magenta(`
 ███████╗██╗███╗   ██╗███████╗██╗   ██╗
 ██╔════╝██║████╗  ██║╚══███╔╝██║   ██║
 ███████╗██║██╔██╗ ██║  ███╔╝ ██║   ██║
 ╚════██║██║██║╚██╗██║ ███╔╝  ██║   ██║
 ███████║██║██║ ╚████║███████╗╚██████╔╝
 ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝ ╚═════╝
 ${config.botName} v${config.version} — prefix: "${config.prefix}"
`));

const appState = loadAppState();
const commands = loadCommands();

wsfca({ appState }, (err, api) => {
  if (err) {
    console.log(chalk.red("[LOGIN FAILED] " + JSON.stringify(err)));
    process.exit(1);
  }

  api.setOptions({ listenEvents: true, selfListen: false });
  console.log(chalk.green(`[LOGIN OK] Logged in as UID ${api.getCurrentUserID()}`));

  api.listenMqtt((err, event) => {
    if (err) {
      console.log(chalk.red("[LISTEN ERROR] " + err.message));
      return;
    }
    if (event.type !== "message" && event.type !== "message_reply") return;

    handleCommand({ api, event, commands, config });
  });
});

// Optional: also boot the dashboard alongside the bot
if (require.main === module && process.env.WITH_DASHBOARD !== "false") {
  require("./dashboard/server");
}
