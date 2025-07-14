const { Kafka } = require('kafkajs');
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
const producer = kafka.producer();

module.exports = {
  startProducer: async () => { await producer.connect(); },
  sendDeviceCreated: async (sensor) => {
    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(sensor) }]
    });
  }
};
