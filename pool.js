var pg = require('pg');

var config = {
  user: 'postgres',
  database: 'bike',
  password: '123',
  host: 'localhost',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 10000
};

var pool = module.exports = new pg.Pool(config);

pool.on('error', function (error, client) {
  console.error('idle client error', error.message, error.stack)
});