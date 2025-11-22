const crypto = require("node:crypto");
const { Client } = require("pg");

const deviceNames = [
  "Temperature Sensor",
  "Humidity Sensor",
  "Motion Detector",
  "Moisture Meter",
  "Water Leak Detector",
];

const categories = ["temperature", "humidity", "motion", "moisture", "leak"];

function generateApiKey() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("hex");
}

async function generateDevices(client, count) {
  for (let i = 0; i < count; i++) {
    await client.query(
      "INSERT INTO devices(name, api_key, category) VALUES($1, $2, $3)",
      [deviceNames[i], generateApiKey(), categories[i]]
    );
  }
}

function generateWavePattern(count, baseline, amplitude, period) {
  const values = [];
  for (let i = 0; i < count; i++) {
    values.push(baseline + amplitude * Math.sin((2 * Math.PI * i) / period));
  }
  return values;
}

function generateBooleans(count, probabilityTrue) {
  const values = [];
  for (let i = 0; i < count; i++) {
    values.push(Math.random() < probabilityTrue);
  }
  return values;
}

function generateTimestamps(count, startTime, intervalMs) {
  const timestamps = [];
  for (let i = 0; i < count; i++) {
    timestamps.push(new Date(startTime.getTime() + i * intervalMs));
  }
  return timestamps;
}

async function clearData(client) {
  await client.query("TRUNCATE TABLE devices CASCADE");
}

async function main() {
  // const client = new Client();
  // await client.connect();
  // await clearData(client);
  // await generateDevices(client, 5);
  console.log(generateWavePattern(100, 20, 3, 20));
  console.log(generateBooleans(100, 0.2));
  console.log(generateTimestamps(100, new Date(Date.UTC(2025, 6, 2, 0)), 1000 * 60 * 15))
  // await client.end();
}

main();
