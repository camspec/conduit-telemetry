require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("../db/pool");

const PORT = process.env.PORT || 3000;

app.get("/devices/:deviceId/telemetry", async (req, res) => {
  const deviceId = req.params.deviceId;
  const limit = parseInt(req.query.limit) || 100;

  // await pool.query(`SELECT reading, unit, recorded_at FROM ${}`)
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
