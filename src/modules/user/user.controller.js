
const Joi = require('joi');
const validateRequest = require('../../middleware/validate-request');
const userService = require('./user.service');

module.exports = {
    registerSchema,
    loginSchema,
    register,
    login,
    refreshToken
}

function loginSchema(req, res, next)
{
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })

    validateRequest(res, req, next, schema, 'Login')
}

function login(req, res, next)
{
    const { email, password } = req.body;
    const ipAddress = req.ip
    userService.login({ email, password, ipAddress })
        .then(({refreshToken, ...account}) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function registerSchema(req, res, next)
{
    const noWhiteSpaceRegex = /^\S*$/;
    const schema = Joi.object({
        username: Joi.string().pattern(noWhiteSpaceRegex).required().messages({
            "string.pattern.base": "No Whitespaces Allowed on username"
        }),
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });

    validateRequest(res, req, next, schema, 'Register');
}

function register(req, res, next)
{
    userService.register(req.body)
        .then(account => res.json(account))
        .catch(next);
}

function refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    userService.refreshToken({ token, ipAddress })
        .then(({ refreshToken, ...account }) => {
            setTokenCookie(res, refreshToken);
            res.json(account);
        })
        .catch(next);
}

function setTokenCookie(res, token) {
    // create cookie with refresh token that expires in 7 days
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7*24*60*60*1000)
    };
    res.cookie('refreshToken', token, cookieOptions);
}
