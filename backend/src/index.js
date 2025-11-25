require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("../db/pool");

const PORT = process.env.PORT || 3000;

app.get("/devices/:deviceId/telemetry", async (req, res) => {
  console.log('Request received');
  console.time('total');
  try {
    const deviceId = req.params.deviceId;
    const limit = parseInt(req.query.limit) || 100;
    
    console.time('device-query');
    const deviceResult = await pool.query(
      "SELECT data_type FROM devices WHERE id = $1",
      [deviceId]
    );
    console.timeEnd('device-query');
    
    if (deviceResult.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }
    
    const dataType = deviceResult.rows[0].data_type;
    const telemetryTable =
      dataType === "numeric" ? "telemetry_numeric" : "telemetry_text";
    
    console.time('telemetry-query');
    const telemetryResult = await pool.query(
      `SELECT * FROM ${telemetryTable} WHERE device_id = $1 ORDER BY recorded_at DESC LIMIT $2`,
      [deviceId, limit]
    );
    console.timeEnd('telemetry-query');
    
    console.timeEnd('total');
    res.json(telemetryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
