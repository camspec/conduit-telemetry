const express = require("express");
const router = express.Router();
const pool = require("../../db/pool.js");
const telemetryRouter = require("./telemetry.js");
const validateDevice = require("../middleware/validateDevice.js");
const { generateApiKey } = require("../utils/crypto.js");

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

router.post("/", validateDevice, async (req, res) => {
  try {
    const { name, category, dataType } = req.body;
    const apiKey = generateApiKey();

    const result = await pool.query(
      "INSERT INTO devices (name, api_key, category, data_type) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, apiKey, category, dataType],
    );

    res.status(201).json({
      success: true,
      message: "Device created successfully",
      device: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding device:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:deviceId", async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    const result = await pool.query(
      "DELETE FROM devices WHERE id = $1 RETURNING *",
      [deviceId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.json({ success: true, message: "Device deleted successfully" });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.use("/:deviceId/telemetry", telemetryRouter);

module.exports = router;
