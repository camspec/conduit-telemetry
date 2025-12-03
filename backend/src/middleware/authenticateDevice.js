const pool = require("../../db/pool.js");

const authenticateDevice = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid authorization header" });
    }
    
    const apiKey = authHeader.split(" ")[1];

    if (!apiKey) {
      return res.status(401).json({ error: "API key required" });
    }

    const deviceId = req.params.deviceId;

    if (!deviceId || isNaN(parseInt(deviceId))) {
      return res.status(400).json({ error: "Invalid device ID" });
    }

    const deviceResult = await pool.query(
      "SELECT data_type FROM devices WHERE id = $1 AND api_key = $2",
      [deviceId, apiKey],
    );

    if (deviceResult.rows.length === 0) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    req.dataType = deviceResult.rows[0].data_type;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authenticateDevice;
