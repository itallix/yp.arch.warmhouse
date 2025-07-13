const { createSensor, getSensorById } = require('../db');
const { sendDeviceCreated } = require('../kafka');

module.exports = {
  getSensors: async (req, res) => {
    // TODO: fetch all sensors
    res.json({ message: 'All sensors' });
  },
  getSensorById: async (req, res) => {
    try {
      const { id } = req.params;

      const sensor = await getSensorById({ id });
      
      if (!sensor) {
        return res.status(404).json({ 
          error: 'Not Found',
          message: `Sensor with id ${id} not found` 
        });
      }

      res.json(sensor);
    } catch (err) {
      console.error('Error retrieving sensor:', err);
      res.status(500).json({ error: 'Internal server error' }); 
    }
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
};
