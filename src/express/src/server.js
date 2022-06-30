require('dotenv').config();

var { app } = require('./router')

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





