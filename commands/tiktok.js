const fs = require("fs-extra");
const { ytDlpDownload } = require("../utils/downloader");

module.exports = {
  config: {
    name: "tiktok",
    aliases: ["tt", "tiktokdl"],
    category: "downloader",
    description: "Download a TikTok video (no watermark, via yt-dlp).",
    usage: "<tiktok url>"
  },
  async run({ api, event, args }) {
    const url = args[0];
    if (!url || !url.includes("tiktok")) {
      return api.sendMessage("📎 Usage: tiktok <video url>", event.threadID);
    }

    api.sendMessage("⏬ Downloading TikTok video...", event.threadID);
    try {
      const filePath = await ytDlpDownload(url);
      api.sendMessage(
        { body: "✅ Here's your TikTok video!", attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.remove(filePath).catch(() => {})
      );
    } catch (err) {
      api.sendMessage(`❌ Failed to download: ${err.message}`, event.threadID);
    }
  }
};
