const path = require("path");
const knexLib = require("knex");

// Initialize Knex with SQLite
const knex = knexLib({
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "table-timer.db")
  },
  useNullAsDefault: true
});

// Create table if it doesn't exist
async function init() {
  const exists = await knex.schema.hasTable("sessions");
  if (!exists) {
    await knex.schema.createTable("sessions", table => {
      table.increments("id").primary();
      table.string("table_name");
      table.integer("duration");
      table.string("ended_at");
    });
  }
}

// Call init immediately
init().catch(err => console.error("DB initialization failed:", err));

// Log a session
async function logSession({ table_name, duration, ended_at }) {
  await knex("sessions").insert({ table_name, duration, ended_at });
}

// Get recent sessions with optional pagination
async function getRecentSessions(limit = 50, offset = 0) {
  return await knex("sessions")
    .orderBy("id", "desc")
    .limit(limit)
    .offset(offset);
}

// Get total number of sessions
async function getTotalSessions() {
  const [{ count }] = await knex("sessions").count("id as count");
  return Number(count);
}

module.exports = { logSession, getRecentSessions, getTotalSessions };
