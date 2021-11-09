
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, RefreshToken } = require('../../models');
var secret = process.env.JWT_SECRET || '';
const crypto = require("crypto");

module.exports = {
  register,
  login,
  refreshToken
}

async function login({ email, password, ipAddress })
{
    const checkEmail = await User.findOne({ where: { email: email } });
    
    if (!checkEmail || !(await bcrypt.compare(password, checkEmail.password))) {
        throw 'Email/Username or Password is Incorrect';
    }

    const jwtToken = generateJwtToken(checkEmail);
    const refreshToken = generateRefreshToken(checkEmail, ipAddress);

    await refreshToken.save();

    return {
        ...responseDetails(checkEmail),
        token: jwtToken,
        refreshToken: refreshToken.token,
        message: "You have logged in",
        status: true
    };
}

async function register(params)
{
    if (await User.findOne({ where: { email: params.email } })) {
        throw `Email ${params.email} is already registered`;
    }

    if (await User.findOne({ where: {username: params.username } })) {
        throw `Username ${params.username} is already taken`;
    }

    const account = new User(params);
    account.password = await hash(params.password);

    await account.save();

    return {
        ...responseDetails(account),
        message: "You have been successfully registered",
        status: true
    }
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const account = await refreshToken.getUser();

    // return account;

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...responseDetails(account),
        token: jwtToken,
        refreshToken: newRefreshToken.token,
        message: "Your token has been refreshed"
    };
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    console.log(account.id);
    return new RefreshToken({
        userId: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

async function getRefreshToken(token) {
    const refreshToken = await refreshTokens.findOne({ where: { token } });
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function responseDetails(data)
{
    const { id, username, email, createdAt } = data;

    return {
        id,
        username,
        email,
        createdAt
    }
}
