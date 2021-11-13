const kafka = require('kafka-node');

const createKafkaTopics = () => {
  const client = new kafka.KafkaClient('localhost:2181');
  const admin = new kafka.Admin(client);
  admin.createTopics(
    [
      {
        topic: 'response_topic',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'restaurant.login',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'restaurant.update',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'restaurant.delete',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'restaurant.addImage',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'customer.create',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'customer.login',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'customer.update',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'customer.addAddress',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'customer.delete',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'customer.addFavorites',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'customer.deleteFavorites',
        partitions: 1,
        replicationFactor: 1,
      },{
        topic: 'order.create',
        partitions: 1,
        replicationFactor: 1,
      }
    ],
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};

module.exports = {
  createKafkaTopics,
};
