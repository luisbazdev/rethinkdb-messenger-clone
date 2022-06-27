require('dotenv').config();

var express = require("express");
var bodyParser = require('body-parser');
var cors = require('cors');

var router  = require('./router');

var app = express();

/**
 * Set Express.js middlewares
 */
app.use(cors({
    origin: process.env.DOMAIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Add the API routes to the '/api/' path
 */
app.use('/api', router);

/**
 * Initialize new HTTP server
 */
var { createServer } = require("http");
var httpServer = createServer(app);

/**
 * Add SocketService class to Express application
 * instance for future use in router.js
 */
var SocketService = require('./socket');
app.set('socketService', new SocketService(httpServer));

module.exports = { httpServer };





