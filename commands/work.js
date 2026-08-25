const economy = require("../utils/economy");

const JOBS = [
  "delivered packages", "fixed a leaky faucet", "coded a website",
  "walked someone's dog", "sold street food", "drove a tricycle",
  "tutored a student", "streamed on Facebook Gaming", "repaired a phone"
];

module.exports = {
  config: {
    name: "work",
    aliases: [],
    category: "economy",
    description: "Work to earn coins (has a cooldown)."
  },
  run({ api, event, config }) {
    const user = economy.getUser(event.senderID);
    const now = Date.now();
    const cooldownMs = config.currency.workCooldownMinutes * 60 * 1000;

    if (now - user.lastWork < cooldownMs) {
      const remain = cooldownMs - (now - user.lastWork);
      const mins = Math.ceil(remain / 60000);
      return api.sendMessage(`⏳ You're tired. Rest for ${mins} more minute(s).`, event.threadID);
    }

    const { workMin, workMax, symbol } = config.currency;
    const earned = Math.floor(Math.random() * (workMax - workMin + 1)) + workMin;
    const job = JOBS[Math.floor(Math.random() * JOBS.length)];

    economy.updateUser(event.senderID, {
      balance: user.balance + earned,
      lastWork: now
    });

    api.sendMessage(`🛠️ You ${job} and earned ${symbol}${earned.toLocaleString()}!`, event.threadID);
  }
};
