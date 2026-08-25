const economy = require("../utils/economy");

module.exports = {
  config: {
    name: "daily",
    aliases: [],
    category: "economy",
    description: "Claim your daily reward."
  },
  run({ api, event, config }) {
    const user = economy.getUser(event.senderID);
    const now = Date.now();
    const cooldownMs = config.currency.dailyCooldownHours * 60 * 60 * 1000;

    if (now - user.lastDaily < cooldownMs) {
      const remain = cooldownMs - (now - user.lastDaily);
      const hrs = Math.floor(remain / 3600000);
      const mins = Math.floor((remain % 3600000) / 60000);
      return api.sendMessage(`⏳ You already claimed your daily. Try again in ${hrs}h ${mins}m.`, event.threadID);
    }

    const { dailyMin, dailyMax, symbol } = config.currency;
    const reward = Math.floor(Math.random() * (dailyMax - dailyMin + 1)) + dailyMin;

    economy.updateUser(event.senderID, {
      balance: user.balance + reward,
      lastDaily: now
    });

    api.sendMessage(`🎁 You claimed your daily reward of ${symbol}${reward.toLocaleString()}!`, event.threadID);
  }
};
