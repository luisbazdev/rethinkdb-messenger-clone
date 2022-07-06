require('dotenv').config();

var rethinkdb = require('rethinkdb');

/**
 * Create a promise which resolves in
 * a connection to RethinkDB database
 */
module.exports = db = rethinkdb.connect({db: process.env.DATABASE});