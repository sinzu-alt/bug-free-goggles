const economy = require("../utils/economy");

module.exports = {
  config: {
    name: "slot",
    aliases: ["slots"],
    category: "economy",
    description: "Bet coins on the slot machine.",
    usage: "<amount>"
  },
  run({ api, event, args, config }) {
    const { minBet, maxBet, symbols, payoutMultiplier } = config.slot;
    const { symbol } = config.currency;
    const user = economy.getUser(event.senderID);

    const bet = parseInt(args[0], 10);
    if (!bet || isNaN(bet)) {
      return api.sendMessage(`🎰 Usage: slot <amount>\nMin bet: ${symbol}${minBet}, Max bet: ${symbol}${maxBet}`, event.threadID);
    }
    if (bet < minBet || bet > maxBet) {
      return api.sendMessage(`❌ Bet must be between ${symbol}${minBet} and ${symbol}${maxBet}.`, event.threadID);
    }
    if (user.balance < bet) {
      return api.sendMessage(`❌ You don't have enough coins. Balance: ${symbol}${user.balance}`, event.threadID);
    }

    const roll = () => symbols[Math.floor(Math.random() * symbols.length)];
    const spin = [roll(), roll(), roll()];
    const display = spin.join(" | ");

    let resultMsg;
    let newBalance;
    if (spin[0] === spin[1] && spin[1] === spin[2]) {
      const winnings = bet * payoutMultiplier;
      newBalance = economy.addBalance(event.senderID, winnings - bet);
      economy.updateUser(event.senderID, { wins: (user.wins || 0) + 1 });
      resultMsg = `🎉 JACKPOT! You won ${symbol}${winnings.toLocaleString()}!`;
    } else if (spin[0] === spin[1] || spin[1] === spin[2] || spin[0] === spin[2]) {
      const winnings = Math.floor(bet * 1.5);
      newBalance = economy.addBalance(event.senderID, winnings - bet);
      resultMsg = `✨ Two match! You won ${symbol}${winnings.toLocaleString()}!`;
    } else {
      newBalance = economy.removeBalance(event.senderID, bet);
      economy.updateUser(event.senderID, { losses: (user.losses || 0) + 1 });
      resultMsg = `💔 No match. You lost ${symbol}${bet.toLocaleString()}.`;
    }

    api.sendMessage(
      `🎰 [ ${display} ] 🎰\n${resultMsg}\nNew balance: ${symbol}${newBalance.toLocaleString()}`,
      event.threadID
    );
  }
};
