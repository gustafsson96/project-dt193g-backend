'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const jwtSetup = require('./auth')
const { Pool } = require('pg');

/* Local development configuration
const pool = new Pool({
    user: 'juliagustafsson',
    host: 'localhost',
    database: 'intern_app_db',
    password: '',
    port: 5432,
});
*/

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

pool.query('SELECT 1')
    .then(() => console.log('Database connected'))
    .catch(err => {
        console.error('Database connection error', err);
        process.exit(1);
    });

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true,
                headers: ['Accept', 'Content-Type', 'Authorization'] 
            }
        }
    });

    // Set up jwt auth
    await jwtSetup(server);

    // Import and register routes
    const authRoutes = require('./routes/authRoutes')(pool);
    server.route(authRoutes);

    const userRoutes = require('./routes/userRoutes')(pool);
    server.route(userRoutes);

    const categoryRoutes = require('./routes/categoryRoutes')(pool);
    server.route(categoryRoutes);

    const productRoutes = require('./routes/productRoutes')(pool);
    server.route(productRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();