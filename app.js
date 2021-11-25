const express = require('express');
const database = require('./database');
const routes = require('./routes/index');
const cookieSession = require('cookie-session');

const app = express();
app.use(express.static('views'));
app.use(express.static('views/public'));
app.use(express.json());
app.use(cookieSession({
    name: 'session',
    keys: ['logedUser'],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use('/', routes, database);
app.use('/login', routes, database);
app.use('/l', routes, database);
app.use('/r', routes, database);
app.use('/registered', routes, database);

module.exports = app;