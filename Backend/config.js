'use strict';
const dotenv = require('dotenv');
const assert = require('assert');
const { Pool, Client } = require('pg')

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production'
const { HOST, HOST_URL, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_HOST } = process.env;

const SECRET_KEY = process.env.SECRET_KEY || 'testEnvSecret';
const PORT = process.env.PORT || 5000;

assert(PORT, 'PORT is required');

//const connectionString = `${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

const pool = new Pool({
    connectionString: isProduction ? process.env.DB_URI : connectionString,
    ssl: { rejectUnauthorized: false }
    //ssl: true,
})

module.exports = { pool }