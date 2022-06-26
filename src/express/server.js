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
 * Initialize new WebSockets server
 */ 
var { Server } = require("socket.io");

var io = new Server(httpServer, {
    cors: {
        origin: process.env.DOMAIN
    }
});

/**
 * Socket.IO server-side events
 */
io.on('connection', (socket) => {
    // Add the socket to a room called the
    // same as the user's Facebook UID for
    // future use in router.js
    socket.on('set uid', (uid) => {
        socket.join(uid);
    });
});

module.exports = { httpServer, io };





