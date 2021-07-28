require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USERNAME,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  port: 5432,
  database: process.env.DATABASE,
});

module.exports = pool;
