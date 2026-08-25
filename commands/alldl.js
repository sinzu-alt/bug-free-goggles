const fs = require("fs-extra");
const { ytDlpDownload } = require("../utils/downloader");
const { pinterestDownload } = require("../utils/downloader");

module.exports = {
  config: {
    name: "alldl",
    aliases: ["download", "dl", "video"],
    category: "downloader",
    description: "Universal downloader — auto-detects Facebook, Instagram, Twitter/X, YouTube, TikTok, Pinterest.",
    usage: "<url>"
  },
  async run({ api, event, args }) {
    const url = args[0];
    if (!url || !url.startsWith("http")) {
      return api.sendMessage("📎 Usage: alldl <link>\nSupports: YouTube, TikTok, Facebook, Instagram, Twitter/X, Pinterest.", event.threadID);
    }

    api.sendMessage("⏬ Detecting platform and downloading...", event.threadID);

    try {
      if (url.includes("pinterest") || url.includes("pin.it")) {
        const { filePath } = await pinterestDownload(url);
        return api.sendMessage(
          { body: "✅ Downloaded from Pinterest!", attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.remove(filePath).catch(() => {})
        );
      }

      // Everything else (YouTube, TikTok, Facebook, Instagram, Twitter/X) via yt-dlp
      const filePath = await ytDlpDownload(url);
      api.sendMessage(
        { body: "✅ Here's your media!", attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.remove(filePath).catch(() => {})
      );
    } catch (err) {
      api.sendMessage(`❌ Failed to download: ${err.message}`, event.threadID);
    }
  }
};
