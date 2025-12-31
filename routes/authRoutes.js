const { options } = require("joi");

module.exports = (pool) => [
    {
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            try {
                const { username, password_hash } = request.payload;
            } catch (err) {

            }
        }, 
        options: {
            auth: false
        }

    }
]