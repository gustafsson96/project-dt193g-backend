const Joi = require('joi');

// User routes for full CRUD functionality

module.exports = (pool) => [
    // Get all users
    {
        method: 'GET',
        path: '/users',
        handler: async (request, h) => {
            try {
                const res = await pool.query('SELECT user_id, username, f_name, l_name, role, email, phone, is_active, start_date FROM users');
                return h.response(res.rows).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: err.message }).code(500);
            }
        }
    },
    // Get a user based on id
    {
        method: 'GET',
        path: '/users/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            try {
                const res = await pool.query('SELECT user_id, username, f_name, l_name, role, email, phone, is_active, start_date FROM users WHERE user_id = $1', [id]);
                if (res.rowCount === 0) {
                    return h.response({ error: 'User not found' }).code(404);
                }
                return h.response(res.rows[0]).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: err.message }).code(500);
            }
        },
        // Joi GET params validation
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        }
    },
    // Add new user
    {
        method: 'POST',
        path: '/users',
        handler: async (request, h) => {
            const { username, password_hash, f_name, l_name, role, email, phone, is_active = true } = request.payload;

            try {
                const result = await pool.query(
                    `INSERT INTO users 
                     (username, password_hash, f_name, l_name, role, email, phone, is_active)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                     RETURNING *`,
                    [username, password_hash, f_name, l_name, role, email, phone, is_active]
                );

                return h.response(result.rows[0]).code(201);
            } catch (err) {
                console.error(err);
                return h.response({ error: err.message }).code(500);
            }
        },
        // Joi PUT validation
        options: {
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(3).max(50).required(),
                    password_hash: Joi.string().min(3).max(255).required(), // Update with different type after adding hashing?
                    f_name: Joi.string().min(3).max(100).required(),
                    l_name: Joi.string().min(3).max(100).required(),
                    role: Joi.string().min(3).max(100).required(),
                    email: Joi.string().email().lowercase().max(255).required(),
                    phone: Joi.string().min(10).max(20).required(),
                    is_active: Joi.boolean().required()
                })
            }
        }
    },
    // Update a user
    {
        method: 'PUT',
        path: '/users/{id}',
        handler: async (request, h) => {
            const { id } = request.params;
            const { username, password_hash, f_name, l_name, role, email, phone, is_active } = request.payload;
            try {
                const result = await pool.query(
                    `UPDATE users
                     SET username = $1,
                         password_hash = $2,
                         f_name = $3,
                         l_name = $4,
                         role = $5,
                         email = $6,
                         phone = $7,
                         is_active = $8
                     WHERE user_id = $9
                     RETURNING *`,
                    [username, password_hash, f_name, l_name, role, email, phone, is_active, id]
                );

                if (result.rowCount === 0) {
                    return h.response({ error: 'User not found' }).code(404);
                }

                return h.response(result.rows[0]).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to update user' }).code(500);
            }
        },
        // Joi PUT validation
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    username: Joi.string().min(3).max(50).required(),
                    password_hash: Joi.string().min(3).max(255).required(), // Update with different type after adding hashing?
                    f_name: Joi.string().min(3).max(100).required(),
                    l_name: Joi.string().min(3).max(100).required(),
                    role: Joi.string().min(3).max(100).required(),
                    email: Joi.string().email().lowercase().max(255).required(),
                    phone: Joi.string().min(10).max(20).required(),
                    is_active: Joi.boolean().required()
                })
            }
        }
    },
    // Delete a user
    {
        method: 'DELETE',
        path: '/users/{id}',
        handler: async (request, h) => {
            const { id } = request.params;

            try {
                const result = await pool.query(
                    `DELETE FROM users WHERE user_id = $1 RETURNING *`,
                    [id]
                );

                if (result.rowCount === 0) {
                    return h.response({ error: 'User not found' }).code(404);
                }

                return h.response(result.rows[0]).code(200);

            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to delete user' }).code(500);
            }
        },
        // Joi DELETE validation
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        }
    }
];