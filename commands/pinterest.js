const fs = require("fs-extra");
const { pinterestDownload } = require("../utils/downloader");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin", "pindl"],
    category: "downloader",
    description: "Download an image/video from a Pinterest pin URL.",
    usage: "<pinterest url>"
  },
  async run({ api, event, args }) {
    const url = args[0];
    if (!url || !url.includes("pinterest") && !url.includes("pin.it")) {
      return api.sendMessage("📎 Usage: pinterest <pin url>", event.threadID);
    }

    api.sendMessage("⏬ Fetching from Pinterest...", event.threadID);
    try {
      const { filePath } = await pinterestDownload(url);
      api.sendMessage(
        { body: "✅ Here you go!", attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.remove(filePath).catch(() => {})
      );
    } catch (err) {
      api.sendMessage(`❌ Failed to fetch: ${err.message}`, event.threadID);
    }
  }
};
