const { exec } = require("child_process");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs-extra");

const TMP_DIR = path.join(__dirname, "..", "tmp");
fs.ensureDirSync(TMP_DIR);

/**
 * Generic downloader for YouTube, TikTok, Facebook, Instagram, Twitter/X
 * Requires yt-dlp installed on the host system (apt/pip install yt-dlp).
 * Returns the local file path of the downloaded media.
 */
function ytDlpDownload(url) {
  return new Promise((resolve, reject) => {
    const outTemplate = path.join(TMP_DIR, `%(id)s.%(ext)s`);
    const cmd = `yt-dlp -f "mp4/best" -o "${outTemplate}" --no-playlist --print after_move:filepath "${url}"`;
    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      const filePath = stdout.trim().split("\n").pop();
      if (!filePath || !fs.existsSync(filePath)) {
        return reject(new Error("yt-dlp finished but no output file was found."));
      }
      resolve(filePath);
    });
  });
}

/**
 * Pinterest downloader - scrapes the og:video / og:image meta tag from a pin page.
 */
async function pinterestDownload(url) {
  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  const $ = cheerio.load(html);
  const videoUrl = $('meta[property="og:video:secure_url"]').attr("content") ||
    $('meta[property="og:video"]').attr("content");
  const imageUrl = $('meta[property="og:image"]').attr("content");

  const mediaUrl = videoUrl || imageUrl;
  if (!mediaUrl) throw new Error("Could not find downloadable media on that Pinterest link.");

  const ext = videoUrl ? "mp4" : "jpg";
  const fileName = `pin_${Date.now()}.${ext}`;
  const filePath = path.join(TMP_DIR, fileName);

  const response = await axios.get(mediaUrl, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, response.data);
  return { filePath, type: videoUrl ? "video" : "image" };
}

module.exports = {
  ytDlpDownload,
  pinterestDownload,
  TMP_DIR
};
