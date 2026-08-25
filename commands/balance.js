const economy = require("../utils/economy");

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "money"],
    category: "economy",
    description: "Check your wallet and bank balance."
  },
  run({ api, event, config }) {
    const user = economy.getUser(event.senderID);
    const { symbol } = config.currency;
    api.sendMessage(
      `💰 Balance\n` +
      `Wallet: ${symbol}${user.balance.toLocaleString()}\n` +
      `Bank: ${symbol}${user.bank.toLocaleString()}\n` +
      `Total: ${symbol}${(user.balance + user.bank).toLocaleString()}`,
      event.threadID
    );
  }
};
