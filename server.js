'use strict';

const Hapi = require('@hapi/hapi');
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
                origin: ['*']
            }
        }
    });

    // Import and register routes
    const productRoutes = require('./routes/productRoutes')(pool);
    server.route(productRoutes);

    const categoryRoutes = require('./routes/categoryRoutes')(pool);
    server.route(categoryRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();