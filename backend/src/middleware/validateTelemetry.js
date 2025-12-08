const validateTelemetry = (req, res, next) => {
  const { reading, unit, recordedAt } = req.body;
  const dataType = req.dataType;

  if (reading === null || reading === undefined) {
    return res.status(400).json({ error: "Reading is required" });
  }

  if (dataType === "numeric") {
    if (typeof reading !== "number" || isNaN(reading)) {
      return res.status(400).json({
        error: "Reading must be a valid number for numeric telemetry",
      });
    }

    if (unit !== null && unit !== undefined) {
      if (typeof unit !== "string" || unit.trim() === "") {
        return res
          .status(400)
          .json({ error: "Unit must be a non-empty string" });
      }
    }
  } else if (dataType === "text") {
    if (typeof reading !== "string" || reading.trim() === "") {
      return res.status(400).json({
        error: "Reading must be a non-empty string for text telemetry",
      });
    }

    if (unit !== null && unit !== undefined) {
      return res
        .status(400)
        .json({ error: "Unit is not allowed for text telemetry" });
    }
  }

  if (recordedAt !== null && recordedAt !== undefined) {
    const timestamp = new Date(recordedAt);

    if (isNaN(timestamp.getTime())) {
      return res
        .status(400)
        .json({ error: "recordedAt must be a valid timestamp" });
    }
  }

  next();
};

module.exports = validateTelemetry;
