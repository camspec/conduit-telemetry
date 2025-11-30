const express = require("express");
const router = express.Router({ mergeParams: true });
const pool = require("../../db/pool.js");

router.get("/", async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const limit = parseInt(req.query.limit) || 100;

    const deviceResult = await pool.query(
      "SELECT data_type FROM devices WHERE id = $1",
      [deviceId],
    );

    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const dataType = deviceResult.rows[0].data_type;
    const telemetryTable =
      dataType === "numeric" ? "telemetry_numeric" : "telemetry_text";

    const telemetryResult = await pool.query(
      `SELECT * FROM ${telemetryTable} WHERE device_id = $1 ORDER BY recorded_at ASC LIMIT $2`,
      [deviceId, limit],
    );

    res.json(telemetryResult.rows);
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
