require("dotenv").config();
const crypto = require("node:crypto");
const { Client } = require("pg");

const devices = [
  {
    name: "Temperature Sensor",
    category: "temperature",
    dataType: "numeric",
    readings: 96,
    unit: "°C",
    pattern: {
      baseline: 20,
      amplitude: 3,
      period: 96,
    },
    timeframe: {
      startTime: new Date(Date.UTC(2025, 6, 1, 0)),
      intervalMs: 1000 * 60 * 15,
    },
  },
  {
    name: "Humidity Sensor",
    category: "humidity",
    dataType: "numeric",
    readings: 96,
    unit: "%",
    pattern: {
      baseline: 50,
      amplitude: 20,
      period: 96,
    },
    timeframe: {
      startTime: new Date(Date.UTC(2025, 6, 1, 0)),
      intervalMs: 1000 * 60 * 15,
    },
  },
  {
    name: "Motion Detector",
    category: "motion",
    dataType: "text",
    readings: 300,
    pattern: {
      probabilityTrue: 0.2,
    },
    timeframe: {
      startTime: new Date(Date.UTC(2025, 7, 1, 0)),
      intervalMs: 1000,
    },
  },
  {
    name: "Moisture Meter",
    category: "moisture",
    dataType: "numeric",
    unit: "%",
    readings: 50,
    pattern: {
      baseline: 40,
      amplitude: 30,
      period: 48,
    },
    timeframe: {
      startTime: new Date(Date.UTC(2025, 6, 1, 0)),
      intervalMs: 1000 * 60 * 30,
    },
  },
  {
    name: "Water Leak Detector",
    category: "leak",
    dataType: "text",
    readings: 48,
    pattern: {
      probabilityTrue: 0.05,
    },
    timeframe: {
      startTime: new Date(Date.UTC(2025, 8, 1, 0)),
      intervalMs: 1000 * 60 * 60,
    },
  },
];

function generateApiKey() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("hex");
}

async function generateDevices(client) {
  const deviceIds = [];
  for (const device of devices) {
    const result = await client.query(
      "INSERT INTO devices(name, api_key, category, data_type) VALUES($1, $2, $3, $4) RETURNING id",
      [device.name, generateApiKey(), device.category, device.dataType]
    );
    deviceIds.push(result.rows[0].id);
  }
  return deviceIds;
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

async function generateTelemetry(client, deviceIds) {
  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];
    const deviceId = deviceIds[i];

    const timestamps = generateTimestamps(
      device.readings,
      device.timeframe.startTime,
      device.timeframe.intervalMs
    );

    if (device.dataType === "numeric") {
      const readings = generateWavePattern(
        device.readings,
        device.pattern.baseline,
        device.pattern.amplitude,
        device.pattern.period
      );

      for (let j = 0; j < device.readings; j++) {
        await client.query(
          "INSERT INTO telemetry_numeric(reading, unit, device_id, recorded_at) VALUES($1, $2, $3, $4)",
          [readings[j], device.unit, deviceId, timestamps[j]]
        );
      }
    } else {
      const readings = generateBooleans(
        device.readings,
        device.pattern.probabilityTrue
      );

      for (let j = 0; j < device.readings; j++) {
        await client.query(
          "INSERT INTO telemetry_text(reading, device_id, recorded_at) VALUES($1, $2, $3)",
          [readings[j].toString(), deviceId, timestamps[j]]
        );
      }
    }
  }
}

async function clearData(client) {
  await client.query("TRUNCATE TABLE devices RESTART IDENTITY CASCADE");
}

async function main() {
  const client = new Client();
  await client.connect();
  await clearData(client);
  const deviceIds = await generateDevices(client);
  await generateTelemetry(client, deviceIds);
  await client.end();
}

main();
