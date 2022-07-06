require('dotenv').config();

var { httpServer } = require('./server');

/**
 * Run the HTTP server
 */
httpServer.listen(process.env.PORT);