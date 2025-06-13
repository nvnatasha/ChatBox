const { Pool } = require('pg');

const pool = new Pool({
  user: 'nvnatasha',
  host: 'localhost',
  database: 'whiskerbop',
  port: 5432,
});

module.exports = pool;

