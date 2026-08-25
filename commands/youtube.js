const fs = require("fs-extra");
const { ytDlpDownload } = require("../utils/downloader");

module.exports = {
  config: {
    name: "youtube",
    aliases: ["yt", "ytdl"],
    category: "downloader",
    description: "Download a YouTube video by URL.",
    usage: "<youtube url>"
  },
  async run({ api, event, args }) {
    const url = args[0];
    if (!url || !url.includes("http")) {
      return api.sendMessage("📎 Usage: youtube <video url>", event.threadID);
    }

    api.sendMessage("⏬ Downloading, please wait...", event.threadID);
    try {
      const filePath = await ytDlpDownload(url);
      api.sendMessage(
        { body: "✅ Here's your video!", attachment: fs.createReadStream(filePath) },
        event.threadID,
        () => fs.remove(filePath).catch(() => {})
      );
    } catch (err) {
      api.sendMessage(`❌ Failed to download: ${err.message}`, event.threadID);
    }
  }
};
