const economy = require("../utils/economy");

module.exports = {
  config: {
    name: "top",
    aliases: ["leaderboard", "rich"],
    category: "economy",
    description: "Shows the richest users."
  },
  run({ api, event, config }) {
    const board = economy.getLeaderboard(10);
    const { symbol } = config.currency;

    if (!board.length) return api.sendMessage("No one has any coins yet.", event.threadID);

    let msg = "🏆 RICHEST USERS 🏆\n\n";
    board.forEach((u, i) => {
      msg += `${i + 1}. ${u.name || u.uid} — ${symbol}${(u.balance + u.bank).toLocaleString()}\n`;
    });

    api.sendMessage(msg, event.threadID);
  }
};
