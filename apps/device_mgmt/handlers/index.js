const { createSensor } = require('../db');
const { sendDeviceCreated } = require('../kafka');

module.exports = {
  getSensors: async (req, res) => {
    // TODO: fetch all sensors
    res.json({ message: 'All sensors' });
  },
  getSensorById: async (req, res) => {
    const { id } = req.params;
    res.json({ message: `Get sensor ${id}` });
  },
  createSensor: async (req, res) => {
    try {
      const { name, type, location, unit } = req.body;
      if (!name || !type || !location || !unit) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const sensor = await createSensor({ name, type, location, unit });
      await sendDeviceCreated(sensor);

      res.status(201).json(sensor);
    } catch (err) {
      console.error('Error creating sensor:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  updateSensor: async (req, res) => {
    const { id } = req.params;
    res.json({ message: `Sensor ${id} updated` });
  },
  deleteSensor: async (req, res) => {
    const { id } = req.params;
    res.json({ message: `Sensor ${id} deleted` });
  },
  updateSensorValue: async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    res.json({ message: `Sensor ${id} value updated to ${value}` });
  },
  getTemperatureByLocation: async (req, res) => {
    const { location } = req.params;
    res.json({ message: `Temperature for location ${location}` });
  },
};
