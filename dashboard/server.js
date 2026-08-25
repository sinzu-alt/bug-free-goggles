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

    if (prefix && prefix !== "non-prefix") config.prefix = pr
