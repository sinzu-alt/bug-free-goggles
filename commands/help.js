module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    category: "general",
    description: "Shows all available commands."
  },
  run({ api, event, args, config, commands }) {
    const p = config.prefix;

    if (args[0]) {
      const cmd = commands.get(args[0].toLowerCase());
      if (!cmd) return api.sendMessage(`❌ No command named "${args[0]}".`, event.threadID);
      return api.sendMessage(
        `📖 ${cmd.config.name}\n` +
        `Category: ${cmd.config.category}\n` +
        `Description: ${cmd.config.description || "No description."}\n` +
        `Usage: ${p}${cmd.config.name} ${cmd.config.usage || ""}`,
        event.threadID
      );
    }

    const grouped = {};
    const seen = new Set();
    for (const [, cmd] of commands) {
      if (seen.has(cmd.config.name)) continue;
      seen.add(cmd.config.name);
      const cat = cmd.config.category || "misc";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(cmd.config.name);
    }

    let msg = `╭───「 ${config.botName} 」\n│ Prefix: ${p}\n╰──────────────\n\n`;
    for (const cat of Object.keys(grouped).sort()) {
      msg += `❖ ${cat.toUpperCase()} (${grouped[cat].length})\n`;
      msg += grouped[cat].sort().map(n => `   ➤ ${n}`).join("\n");
      msg += "\n\n";
    }
    msg += `Type "${p}help <command>" for details on a specific command.`;

    api.sendMessage(msg, event.threadID);
  }
};
