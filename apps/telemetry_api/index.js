import express from 'express';
import dotenv from 'dotenv';
import { influx } from './influx.js';
import { startKafka } from './kafka.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;
const INTERVAL = +process.env.INTERVAL_SECS || 30;

const activeDevices = new Set();

function simulateTelemetry(deviceId) {
  if (activeDevices.has(deviceId)) return;
  activeDevices.add(deviceId);

  setInterval(async () => {
    const temperature = 15 + Math.random() * 20;
    try {
      await influx.writePoints([{
        measurement: 'temperature',
        tags: { device_id: deviceId },
        fields: { value: temperature },
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error('Error writing to InfluxDB', err);
    }
  }, INTERVAL * 1000);
}

// API endpoint: GET /temperature/:id
app.get('/temperature/:id', async (req, res) => {
  const deviceId = req.params.id;

  try {
    const result = await influx.query(`
      SELECT LAST("value") FROM "temperature"
      WHERE "device_id" = '${deviceId}'
    `);

    if (result.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    res.json({
      device_id: deviceId,
      timestamp: result[0].time,
      value: result[0].value
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Start HTTP server
app.listen(PORT, () => {
  console.log(`Telemetry API running on http://localhost:${PORT}`);
});

// Start Kafka Consumer
startKafka((device) => {
  console.log(`New device registered: ${device.id}`);
  simulateTelemetry(device.id);
});
