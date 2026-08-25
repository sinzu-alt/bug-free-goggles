const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const APPSTATE_PATH = path.join(__dirname, "appstate.json");

/**
 * Sinzu Bot uses cookie-based login (appstate), the same approach GoatBot/Zark-style
 * bots use, since Facebook blocks direct username/password bot logins.
 *
 * Two ways to provide credentials:
 *   1. Paste your Facebook cookie (the raw "c_user=...; xs=...;" string, or a
 *      c3c-fbstate exported JSON) into appstate.json directly.
 *   2. Use the c3c-fbstate CLI locally to turn email/password + 2FA into an
 *      appstate.json, then drop that file next to this one.
 *
 * This project never asks for or stores raw passwords inside the bot itself —
 * only the exported session cookie (appstate), which is what ws3-fca needs.
 *
 * IMPORTANT: this no longer kills the process when appstate is missing.
 * Instead the dashboard stays up so you can paste your cookie there, then
 * the bot picks it up on the next restart.
 */
function loadAppState() {
  if (!fs.existsSync(APPSTATE_PATH)) {
    console.log(chalk.red("[LOGIN] appstate.json not found."));
    console.log(chalk.yellow("Open the dashboard and paste your exported cookie JSON, then restart the service."));
    return null;
  }
  try {
    return fs.readJsonSync(APPSTATE_PATH);
  } catch (e) {
    console.log(chalk.red("[LOGIN] appstate.json is not valid JSON: " + e.message));
    return null;
  }
}

/**
 * Convert a raw "key=value; key2=value2;" cookie header string (as copied from
 * devtools) into the array-of-objects format ws3-fca / GoatBot-style appstate expects.
 */
function cookieStringToAppState(cookieStr) {
  return cookieStr.split(";").map(pair => {
    const [key, ...rest] = pair.trim().split("=");
    return {
      key,
      value: rest.join("="),
      domain: "facebook.com",
      path: "/",
      hostOnly: false,
      creation: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    };
  }).filter(c => c.key);
}

module.exports = { loadAppState, cookieStringToAppState, APPSTATE_PATH };
