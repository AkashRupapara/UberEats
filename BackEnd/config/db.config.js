module.exports = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: 'akash1743a',
  DB: 'ubereats',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
