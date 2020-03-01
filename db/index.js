const { Pool } = require('pg');

require('dotenv').config();

const postgresURI = process.env.POSTGRES_URI;

const pool = new Pool({ connectionString: postgresURI });

module.exports = {
  query: (text, params) => pool.query(text, params)
};
