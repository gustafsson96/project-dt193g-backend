const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');

/* Handles user authentication with JWT */
async function loginUser(pool, username, password) {
    const result = await pool.query(
        'SELECT user_id, username, password_hash FROM users WHERE username = $1',
        [username]
    );

    if (result.rowCount === 0) return null;


    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) return null;

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
            ttlSec: 24 * 60 * 60
        }
    );

    return token;
}

module.exports = { loginUser };