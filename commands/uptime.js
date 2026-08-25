module.exports = {
  config: {
    name: "uptime",
    aliases: ["ping"],
    category: "general",
    description: "Shows how long the bot has been running."
  },
  run({ api, event }) {
    const seconds = Math.floor(process.uptime());
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    api.sendMessage(`🟢 Online for ${h}h ${m}m ${s}s`, event.threadID);
  }
};
