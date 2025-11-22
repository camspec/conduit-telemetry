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

async function generateDevices(client, number) {
  for (let i = 0; i < number; i++) {
    await client.query(
      "INSERT INTO devices(name, api_key, category) VALUES($1, $2, $3)",
      [deviceNames[i], generateApiKey(), categories[i]]
    );
  }
}

async function clearData(client) {
  await client.query("TRUNCATE TABLE devices CASCADE");
}

async function main() {
  const client = new Client();
  await client.connect();
  await clearData(client);
  await generateDevices(client, 5);
  await client.end();
}

main();
