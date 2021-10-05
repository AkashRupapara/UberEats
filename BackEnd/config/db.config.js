module.exports = {
  HOST: 'ubereats.c6tdv69otwaf.us-east-1.rds.amazonaws.com',
  USER: 'root',
  PASSWORD: 'Akash1743a',
  DB: 'ubereats',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
