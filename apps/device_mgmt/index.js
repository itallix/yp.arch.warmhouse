require('dotenv').config();
const express = require('express');
const { startProducer } = require('./kafka');
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

router.use('/sensors', sensors);
app.use('/', router);

app.listen(PORT, () => console.log(`Device Management running on port ${PORT}`));
