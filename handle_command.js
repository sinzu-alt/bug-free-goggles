const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function loadCommands() {
  const commands = new Map();
  const commandsDir = path.join(__dirname, "commands");
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith(".js"));

  for (const file of files) {
    try {
      const command = require(path.join(commandsDir, file));
      if (!command.config || !command.config.name) {
        console.log(chalk.yellow(`[SKIP] ${file} has no config.name`));
        continue;
      }
      commands.set(command.config.name.toLowerCase(), command);
      if (command.config.aliases) {
        for (const alias of command.config.aliases) {
          commands.set(alias.toLowerCase(), command);
        }
      }
    } catch (e) {
      console.log(chalk.red(`[ERROR] Failed loading ${file}: ${e.message}`));
    }
  }
  console.log(chalk.cyan(`[COMMANDS] Loaded ${commands.size} command entries.`));
  return commands;
}

function handleCommand({ api, event, commands, config }) {
  const body = (event.body || "").trim();
  if (!body.startsWith(config.prefix)) return;

  const args = body.slice(config.prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();
  const command = commands.get(commandName);

  if (!command) return;

  try {
    command.run({ api, event, args, config, commands });
  } catch (err) {
    console.log(chalk.red(`[COMMAND ERROR] ${commandName}: ${err.message}`));
    api.sendMessage(`⚠️ Error running "${commandName}": ${err.message}`, event.threadID);
  }
}

module.exports = { loadCommands, handleCommand };
