const express = require("express");
const router = express.Router();
const pool = require("../../db/pool.js");
const telemetryRouter = require("./telemetry.js");

router.get("/", async (req, res) => {
  try {
    const deviceResult = await pool.query(
      "SELECT id, name, category, data_type, created_at FROM devices",
    );

    // just return an empty array if no devices exist
    res.json(deviceResult.rows);
  } catch (error) {
    console.error("Error fetching list of devices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:deviceId", async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const deviceResult = await pool.query(
      "SELECT id, name, category, data_type, created_at FROM devices WHERE id = $1",
      [deviceId],
    );

    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.json(deviceResult.rows[0]);
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.use("/:deviceId/telemetry", telemetryRouter);

module.exports = router;
