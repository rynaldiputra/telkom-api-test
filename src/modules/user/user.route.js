
const {
    registerSchema,
    loginSchema,
    register,
    login,
    refreshToken
} = require('./user.controller');
const router = require('express').Router();

router.post('/register', registerSchema, register);
router.post('/login', loginSchema, login);
router.post('/refresh-token', refreshToken);

module.exports = router
