import { InfluxDB, FieldType } from 'influx';
import dotenv from 'dotenv';

dotenv.config();

export const influx = new InfluxDB({
  host: process.env.INFLUX_URL.replace('http://', '').split(':')[0],
  port: +process.env.INFLUX_URL.split(':')[2],
  database: process.env.INFLUX_DB,
  schema: [{
    measurement: 'temperature',
    fields: { value: FieldType.FLOAT },
    tags: ['device_id']
  }]
});
