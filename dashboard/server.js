const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs-extra");

const config = require("../config.json");
const { cookieStringToAppState, APPSTATE_PATH } = require("../login");
const configPath = path.join(__dirname, "..", "config.json");

const app = express();
app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/configure", (req, res) => {
  try {
    const { appstate, prefix, uid } = req.body;
    if (!appstate) return res.status(400).json({ ok: false, error: "Missing appstate/cookie." });

    let parsed;
    const trimmed = appstate.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      parsed = JSON.parse(trimmed);
    } else {
      parsed = cookieStringToAppState(trimmed);
    }
    fs.writeJsonSync(APPSTATE_PATH, parsed, { spaces: 2 });

    if (prefix && prefix !== "non-prefix") config.prefix = prefix;
    if (uid && uid !== "default") {
      if (!config.admins.includes(uid)) config.admins.push(uid);
    }
    fs.writeJsonSync(configPath, config, { spaces: 2 });

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || config.dashboard?.port || 8080;
app.listen(PORT, () => {
  console.log(`[DASHBOARD] Running at http://localhost:${PORT}`);
});

module.exports = app;
