
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const userRoute = require('./src/modules/user/user.route');
const bookRoute = require('./src/modules/book/book.route');

app.use(express.json());
app.use(cors());

const userPrefixUrl = '/api/v1/user';
const bookPrefixUrl = '/api/v1/book';

app.use(userPrefixUrl, userRoute);
app.use(bookPrefixUrl, bookRoute)

app.listen(process.env.APP_PORT, () => {
    console.log('Server Started on Port: ', process.env.APP_PORT);
});

module.exports = app;
