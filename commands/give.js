const economy = require("../utils/economy");

module.exports = {
  config: {
    name: "give",
    aliases: ["pay", "transfer"],
    category: "economy",
    description: "Give coins to someone you're replying to.",
    usage: "<amount> (reply to their message)"
  },
  run({ api, event, args, config }) {
    const { symbol } = config.currency;
    if (!event.messageReply) {
      return api.sendMessage("↩️ Reply to the person's message with: give <amount>", event.threadID);
    }
    const amount = parseInt(args[0], 10);
    if (!amount || amount <= 0) {
      return api.sendMessage("❌ Enter a valid amount to give.", event.threadID);
    }

    const receiverID = event.messageReply.senderID;
    if (receiverID === event.senderID) {
      return api.sendMessage("❌ You can't give coins to yourself.", event.threadID);
    }

    const sender = economy.getUser(event.senderID);
    if (sender.balance < amount) {
      return api.sendMessage(`❌ Insufficient balance. You have ${symbol}${sender.balance}.`, event.threadID);
    }

    economy.removeBalance(event.senderID, amount);
    economy.addBalance(receiverID, amount);

    api.sendMessage(`✅ You gave ${symbol}${amount.toLocaleString()} to the replied user.`, event.threadID);
  }
};
