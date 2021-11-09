require('dotenv').config()
const jwt = require('express-jwt');
const { User } = require('../models');

module.exports = authorize;

function authorize() {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    // if (typeof roles === 'string') {
    //     roles = [roles];
    // }
    
    var secret = process.env.JWT_SECRET || ''

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        async (req, res, next) => {
            const account = await User.findByPk(req.user.id);
            console.log(req.user)

            if (!account) {
                // account no longer exists or role not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            // req.user.role = account.role;
            const refreshTokens = await account.getRefreshTokens();
            req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);

            next();
        }
    ];
}