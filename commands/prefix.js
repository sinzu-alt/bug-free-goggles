const fs = require("fs-extra");
const path = require("path");
const configPath = path.join(__dirname, "..", "config.json");

module.exports = {
  config: {
    name: "prefix",
    aliases: ["setprefix"],
    category: "general",
    description: "Shows or changes the bot's command prefix (admin only to change).",
    usage: "[newPrefix]"
  },
  run({ api, event, args, config }) {
    if (!args[0]) {
      return api.sendMessage(`Current prefix is: "${config.prefix}"`, event.threadID);
    }

    if (!config.admins.includes(event.senderID)) {
      return api.sendMessage("❌ Only bot admins can change the prefix.", event.threadID);
    }

    const newPrefix = args[0];
    config.prefix = newPrefix;
    fs.writeJsonSync(configPath, config, { spaces: 2 });
    api.sendMessage(`✅ Prefix changed to: "${newPrefix}"`, event.threadID);
  }
};
