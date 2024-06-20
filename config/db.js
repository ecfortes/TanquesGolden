// config/db.js
const pg = require('pg');

const config = {
  user: 'postgres',    // Seu nome de usu�rio do PostgreSQL
  database: 'postgres', // Nome do banco de dados
  password: '1234567890', // Sua senha do PostgreSQL
  host: 'localhost',    // Host do banco de dados
  port: 5432,           // Porta padr�o do PostgreSQL
};

const pool = new pg.Pool(config);

module.exports = pool;
