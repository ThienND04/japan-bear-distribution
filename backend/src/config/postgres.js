const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL connection pool instance
 * Manages database connections with automatic pooling and connection reuse
 * @type {import('pg').Pool}
 */
const pool = new Pool({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'my_database',
    password: process.env.POSTGRES_PASSWORD || 'secret',
    port: process.env.DB_PORT || 5432,
});

/**
 * Execute a SQL query on the database
 * @param {string} text - SQL query string with optional placeholders ($1, $2, etc.)
 * @param {Array} [params] - Query parameters to prevent SQL injection
 * @returns {Promise<import('pg').QueryResult>} Query result with rows array
 * @example
 * const result = await query('SELECT * FROM bears WHERE year = $1', [2020]);
 */
const query = (text, params) => pool.query(text, params);


pool.on('connect', () => {
    console.log('Database connected');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query,
    pool,
};