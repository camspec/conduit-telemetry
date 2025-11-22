const crypto = require("node:crypto");

deviceNames = [
  "Temperature Sensor",
  "Humidity Sensor",
  "Motion Detector",
  "Moisture Meter",
  "Water Leak Detector",
];

categories = ["temperature", "humidity", "motion", "moisture", "leak"];

function generateApiKey() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("hex");
}

function generateDevices(number) {
  for (let i = 0; i < number; i++) {
    
  }
}
