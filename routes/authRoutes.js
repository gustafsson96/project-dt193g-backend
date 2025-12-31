const Joi = require('joi');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

module.exports = (pool) => [
    {
        method: 'POST',
        path: '/login',
        options: {
            auth: false, 
            validate: {
                payload: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {
            const { username, password } = request.payload;

            try {
                const result = await pool.query(
                    'SELECT user_id, username, password_hash FROM users WHERE username = $1',
                    [username]
                );

                if(result.rowCount === 0) {
                    return h.response({ error: 'Invalid username or password'}).code(401);
                }

                const user = result.rows[0];

                // Place this functionality in its own controller file? 
                const isValid = await bcrypt.compare(password, user.password_hash);
                if(!isValid) {
                    return h.response({ error: 'Invalid username or password'}).code(401);
                }

                const token = Jwt.token.generate(
                    {
                        user: {
                            id: user.user_id,
                            username: user.username
                        }
                    },
                    {
                        key: process.env.JWT_SECRET,
                        algorithm: 'HS256'
                    },
                    {
                        ttlSec: 24* 60 * 60
                    }
                );

                return h.response({ token }).code(200);
            } catch (err) {
                console.error(err);
                return h.response({ error: 'Login failed' }).code(500);
            }
        }
    }
]