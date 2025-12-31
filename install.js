'use strict';

const { Pool } = require('pg');

// Create a local PostgreSQL connection pool
const pool = new Pool({
    user: 'juliagustafsson',
    host: 'localhost',
    database: 'intern_app_db',
    password: '',
    port: 5432
});

// Create "users", "categories" and "products" tables if they don't exist
(async () => {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE users (
                user_id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                f_name VARCHAR(50) NOT NULL,
                l_name VARCHAR(50) NOT NULL,
                role VARCHAR(50) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone VARCHAR(20),
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                start_date DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `);
        console.log('Table "users" has been created');

        // Create categories table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT
            )
        `);
        console.log('Table "categories" has been created');

        // Create products table with foreign key to categories
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category_id INT REFERENCES categories(id) ON DELETE SET NULL,
                color VARCHAR(50),
                amount INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table "products" has been created');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
})();