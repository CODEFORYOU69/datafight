import { expressjwt } from 'express-jwt';
import util from 'util';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

require('dotenv').config();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    

    const middleware = expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/Register',
            '/api/users/authenticate',
            '/api/users/forgotpassword'
        ]
    });


    return util.promisify(middleware)(req, res);
}