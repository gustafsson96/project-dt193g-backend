// Code imported and modified from Hapi documentation regarding usage of the jwt package to test
// https://hapi.dev/module/jwt/ 

const Jwt = require('@hapi/jwt');

module.exports = async (server) => {
    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.JWT_SECRET,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400
        },
        validate: (artifacts, request, h) => {
            return {
                isValid: true,
                credentials: artifacts.decoded.payload
            };
        }
    });
};