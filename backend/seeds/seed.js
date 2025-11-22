const crypto = require("node:crypto");
const { Client } = require("pg");

const devices = [
  {
    name: "Temperature Sensor",
    category: "temperature",
    dataType: "numeric",
    timeframe: {
      count: 100,
      startTime: new Date(Date.UTC(2025, 6, 1, 0)),
      intervalMs: 1000 * 60 * 15,
    },
  },
  {
    name: "Humidity Sensor",
    category: "humidity",
    dataType: "numeric",
    timeframe: {
      count: 100,
      startTime: new Date(Date.UTC(2025, 6, 1, 0)),
      intervalMs: 1000 * 60 * 15,
    },
  },
  {
    name: "Motion Detector",
    category: "motion",
    dataType: "text",
    timeframe: {
      count: 300,
      startTime: new Date(Date.UTC(2025, 7, 1, 0)),
      intervalMs: 1000,
    },
  },
  {
    name: "Moisture Meter",
    category: "moisture",
    dataType: "numeric",
    timeframe: {
      count: 50,
      startTime: new Date(Date.UTC(2025, 6, 1, 0)),
      intervalMs: 1000 * 60 * 30,
    },
  },
  {
    name: "Water Leak Detector",
    category: "leak",
    dataType: "text",
    timeframe: {
      count: 48,
      startTime: new Date(Date.UTC(2025, 8, 1, 0)),
      intervalMs: 1000 * 60,
    },
  },
];

function generateApiKey() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("hex");
}

async function generateDevices(client) {
  for (const device of devices) {
    await client.query(
      "INSERT INTO devices(name, api_key, category) VALUES($1, $2, $3)",
      [device.name, generateApiKey, device.category]
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
  console.log(
    generateTimestamps(100, new Date(Date.UTC(2025, 6, 1, 0)), 1000 * 60 * 15)
  );
  // await client.end();
}

main();
