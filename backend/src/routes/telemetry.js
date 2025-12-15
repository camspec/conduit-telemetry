const express = require("express");
const router = express.Router({ mergeParams: true });
const pool = require("../../db/pool.js");
const authenticateDevice = require("../middleware/authenticateDevice.js");
const validateTelemetry = require("../middleware/validateTelemetry.js");

router.get("/", async (req, res) => {
  try {
    const deviceId = req.params.deviceId;

    if (!deviceId || isNaN(parseInt(deviceId))) {
      return res.status(400).json({ error: "Invalid device ID" });
    }

    let limit = req.query.limit != null ? parseInt(req.query.limit) : 100;
    let start = req.query.start ?? null;
    let end = req.query.end ?? null;

    if (start === null && end === null) {
      if (isNaN(limit) || limit < 1 || limit > 1000) {
        return res
          .status(400)
          .json({ error: "Limit must be a valid integer between 1 to 1000" });
      }
    }

    let startTimestamp = start ? new Date(start) : null;
    let endTimestamp = end ? new Date(end) : null;

    if (start !== null && isNaN(startTimestamp.getTime())) {
      return res
        .status(400)
        .json({ error: "Start time must be a valid timestamp" });
    }

    if (end !== null && isNaN(endTimestamp.getTime())) {
      return res
        .status(400)
        .json({ error: "End time must be a valid timestamp" });
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

    let conditions = ["device_id = $1"];
    let params = [deviceId];
    let paramIndex = 2;

    if (start !== null) {
      conditions.push(`recorded_at >= $${paramIndex}`);
      params.push(startTimestamp);
      paramIndex++;
    }

    if (end !== null) {
      conditions.push(`recorded_at <= $${paramIndex}`);
      params.push(endTimestamp);
      paramIndex++;
    }

    let query = `SELECT * FROM ${telemetryTable} WHERE ${conditions.join(" AND ")} ORDER BY recorded_at ASC`;

    if (start === null && end === null) {
      query += ` LIMIT $${paramIndex}`;
      params.push(limit);
    }

    const telemetryResult = await pool.query(query, params);

    res.json(telemetryResult.rows);
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authenticateDevice, validateTelemetry, async (req, res) => {
  try {
    const { reading, unit, recordedAt } = req.body;
    const dataType = req.dataType; // retrieved from auth middleware
    const deviceId = req.params.deviceId;

    let insertedRow;

    if (dataType === "numeric") {
      const query = recordedAt
        ? "INSERT INTO telemetry_numeric (reading, unit, device_id, recorded_at) VALUES ($1, $2, $3, $4) RETURNING *"
        : "INSERT INTO telemetry_numeric (reading, unit, device_id) VALUES ($1, $2, $3) RETURNING *";
      const params = recordedAt
        ? [reading, unit, deviceId, recordedAt]
        : [reading, unit, deviceId];
      const result = await pool.query(query, params);
      insertedRow = result.rows[0];
    } else if (dataType === "text") {
      const query = recordedAt
        ? "INSERT INTO telemetry_text (reading, device_id, recorded_at) VALUES ($1, $2, $3) RETURNING *"
        : "INSERT INTO telemetry_text (reading, device_id) VALUES ($1, $2) RETURNING *";
      const params = recordedAt
        ? [reading, deviceId, recordedAt]
        : [reading, deviceId];
      const result = await pool.query(query, params);
      insertedRow = result.rows[0];
    }

    req.app.locals.broadcast({
      type: "telemetry_update",
      deviceId: req.params.deviceId,
      data: {
        id: insertedRow.id,
        reading: insertedRow.reading,
        unit: insertedRow.unit,
        recordedAt: insertedRow.recorded_at,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Telemetry recorded successfully" });
  } catch (error) {
    console.error("Error uploading telemetry:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
