const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || 'root',
    host: 'localhost',
    port: 5432,
    database: process.env.DB || 'hotels_film_db_simplified'
});


module.exports = pool;