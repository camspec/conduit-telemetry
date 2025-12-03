const express = require("express");
const router = express.Router({ mergeParams: true });
const pool = require("../../db/pool.js");
const authenticateDevice = require("../middleware/authenticateTelemetry.js");
const validateTelemetry = require("../middleware/validateTelemetry.js");

router.get("/", async (req, res) => {
  try {
    const deviceId = req.params.deviceId;

    if (!deviceId || isNaN(parseInt(deviceId))) {
      return res.status(400).json({ error: "Invalid device ID" });
    }

    let limit = parseInt(req.query.limit);

    if (isNaN(limit) || limit < 1 || limit > 1000) {
      return res
        .status(400)
        .json({ error: "Limit must be a valid integer between 1 to 1000" });
    }

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

router.post("/", authenticateDevice, validateTelemetry, async (req, res) => {
  try {
    const { reading, unit, recordedAt } = req.body;
    const dataType = req.dataType;
    const deviceId = req.params.deviceId;

    if (dataType === "numeric") {
      await pool.query(
        "INSERT INTO telemetry_numeric (reading, unit, device_id, recorded_at) VALUES ($1, $2, $3, $4)",
        [reading, unit, deviceId, recordedAt],
      );
    } else if (dataType === "text") {
      await pool.query(
        "INSERT INTO telemetry_text (reading, device_id, recorded_at) VALUES ($1, $2, $3)",
        [reading, deviceId, recordedAt],
      );
    }

    res
      .status(201)
      .json({ success: true, message: "Telemetry recorded successfully" });
  } catch (error) {
    console.error("Error uploading telemetry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
