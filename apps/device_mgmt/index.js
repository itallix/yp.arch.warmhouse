require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { createSensor } = require('./db');
const { startProducer, sendDeviceCreated } = require('./kafka');
const sensorHandlers = require('./handlers');

const app = express();
const PORT = process.env.PORT || 8083;
app.use(express.json());

startProducer();

const router = express.Router();
const sensors = express.Router();

sensors.get('/', sensorHandlers.getSensors);
sensors.get('/:id', sensorHandlers.getSensorById);
sensors.post('/', sensorHandlers.createSensor);
sensors.put('/:id', sensorHandlers.updateSensor);
sensors.delete('/:id', sensorHandlers.deleteSensor);
sensors.patch('/:id/value', sensorHandlers.updateSensorValue);
sensors.get('/temperature/:location', sensorHandlers.getTemperatureByLocation);

router.use('/sensors', sensors);
app.use('/', router);

app.post('/sensors', async (req, res) => {
  const id = uuidv4();
  const name = req.body.name || 'Unnamed Sensor';

  await createSensor(id, name);
  await sendDeviceCreated({ id, name });

  res.status(201).json({ id, name });
});

app.listen(PORT, () => console.log(`Device Management running on port ${PORT}`));
