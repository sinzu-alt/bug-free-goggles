# Sinzu Bot

A GoatBot-style Facebook Messenger bot built on **ws3-fca**, with an **economy system**
(wallet, daily, work, slot machine, leaderboard), a **multi-platform video downloader**
(YouTube, TikTok, Facebook, Instagram, Twitter/X via `yt-dlp`, plus Pinterest via scraping),
and a dashboard UI styled after the screenshots you shared.

## ⚠️ Before you start

Facebook does **not** offer an official bot API for personal accounts, and automating a
personal account with tools like `ws3-fca` / `c3c-fbstate` goes against Facebook's Terms
of Service — accounts used this way can get flagged, checkpointed, or banned. Use a
throwaway/test account, not your main one, and understand the risk before deploying this.

## 1. Install dependencies

```bash
npm install
```

You also need **yt-dlp** installed on the host machine (used for YouTube/TikTok/Facebook/
Instagram/Twitter downloads):

```bash
# Linux/macOS
pip install -U yt-dlp
# or
brew install yt-dlp
```

## 2. Get your Facebook login cookie (appstate)

`c3c-fbstate` is the modern replacement for the old `fbstate`/email-password login flow
(FB now blocks that for most accounts). Generate your appstate locally:

```bash
npx c3c-fbstate
```

Follow its prompts (it opens a login flow and exports a cookie JSON). Save the result as
`appstate.json` in the project root — **or** just paste the exported JSON into the
dashboard's textarea (see below) and it will write the file for you.

## 3. Configure via the dashboard

```bash
npm run dashboard
```

Open `http://localhost:8080`, paste your appstate/cookie, pick a prefix, optionally set
your Facebook UID as bot admin, tick the terms box, and submit. This writes
`appstate.json` and updates `config.json`.

## 4. Run the bot

```bash
npm start
```

This logs in, loads every file in `/commands`, and starts listening for messages. The
dashboard also boots alongside it unless you set `WITH_DASHBOARD=false`.

## Commands included

| Category  | Commands |
|-----------|----------|
| General   | help, prefix, uptime |
| Economy   | balance, daily, work, slot, top, give |
| Downloader| youtube, tiktok, pinterest, alldl (auto-detects platform) |

All economy data is stored in `database/users.json` (plain JSON — swap in a real DB like
MongoDB/SQLite if you expect heavy traffic).

## Adding more commands

Drop a new file in `/commands`, following this shape:

```js
module.exports = {
  config: { name: "example", aliases: [], category: "fun", description: "..." },
  run({ api, event, args, config, commands }) { /* ... */ }
};
```

It's auto-loaded on startup — no registration needed elsewhere.
