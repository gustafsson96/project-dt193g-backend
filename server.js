'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const jwtSetup = require('./auth')
const { Pool } = require('pg');

// Local development configuration
const pool = new Pool({
    user: 'juliagustafsson',
    host: 'localhost',
    database: 'intern_app_db',
    password: '',
    port: 5432,
});

const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true,
                maxAge: 86400,
                headers: ['Accept', 'Content-Type', 'Access-Control-Allow-Origin']
            }
        }
    });

    // Set up jwt auth
    await jwtSetup(server);

    // Import and register routes
    const productRoutes = require('./routes/productRoutes')(pool);
    server.route(productRoutes);

    const categoryRoutes = require('./routes/categoryRoutes')(pool);
    server.route(categoryRoutes);

    const userRoutes = require('./routes/userRoutes')(pool);
    server.route(userRoutes);

    const authRoutes = require('./routes/authRoutes')(pool);
    server.route(authRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();