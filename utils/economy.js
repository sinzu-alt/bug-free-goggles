const fs = require("fs-extra");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "database", "users.json");
const config = require("../config.json");

function loadDB() {
  fs.ensureFileSync(DB_PATH);
  let raw = fs.readFileSync(DB_PATH, "utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function ensureUser(db, uid, name = "Unknown") {
  if (!db[uid]) {
    db[uid] = {
      name,
      balance: config.currency.startingBalance,
      bank: 0,
      lastDaily: 0,
      lastWork: 0,
      wins: 0,
      losses: 0
    };
  }
  return db[uid];
}

function getUser(uid, name) {
  const db = loadDB();
  const user = ensureUser(db, uid, name);
  saveDB(db);
  return user;
}

function updateUser(uid, updates) {
  const db = loadDB();
  ensureUser(db, uid);
  db[uid] = { ...db[uid], ...updates };
  saveDB(db);
  return db[uid];
}

function addBalance(uid, amount, name) {
  const db = loadDB();
  const user = ensureUser(db, uid, name);
  user.balance += amount;
  saveDB(db);
  return user.balance;
}

function removeBalance(uid, amount) {
  const db = loadDB();
  const user = ensureUser(db, uid);
  user.balance = Math.max(0, user.balance - amount);
  saveDB(db);
  return user.balance;
}

function getLeaderboard(limit = 10) {
  const db = loadDB();
  return Object.entries(db)
    .map(([uid, data]) => ({ uid, ...data }))
    .sort((a, b) => (b.balance + b.bank) - (a.balance + a.bank))
    .slice(0, limit);
}

module.exports = {
  loadDB,
  saveDB,
  getUser,
  updateUser,
  addBalance,
  removeBalance,
  getLeaderboard
};
