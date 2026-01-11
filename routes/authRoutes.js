const Joi = require('joi');

module.exports = (pool) => [
    {
        method: 'POST',
        path: '/signup',
        handler: async (request, h) => {
            const { username, password, f_name, l_name, email, phone } = request.payload;

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const result = await pool.query(
                    `INSERT INTO users (username, password_hash, f_name, l_name, role, email, phone, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, true)
                 RETURNING user_id, username, f_name, l_name, email, phone, role, is_active`,
                    [username, hashedPassword, f_name, l_name, 'user', email, phone || null]
                );
                return h.response(result.rows[0]).code(201);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Failed to create user ' }).code(500);
            }
        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(3).max(50).required(),
                    password: Joi.string().min(6).max(255).required(),
                    f_name: Joi.string().min(2).max(100).required(),
                    l_name: Joi.string().min(2).max(100).required(),
                    email: Joi.string().email().required().required(),
                    phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(12).required()
                })
            }
        }
    },
    {
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            const { username, password } = request.payload;

            try {
                const token = await loginUser(pool, username, password);

                if (!token) {
                    return h.response({ error: 'Invalid username or password' }).code(401);
                }

                return h.response({ token }).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Login failed' }).code(500);
            }
        },
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            }
        }
    }
]