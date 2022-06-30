require('dotenv').config();

var r = require('rethinkdb');
var express = require('express');

var db = require('./db');

var router = express.Router();

/**
 * Express application
 */
var express = require("express");
var app = express();

/**
 * Set Express.js middlewares
 */
var bodyParser = require('body-parser');
var cors = require('cors');

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
 * Try to connect to RethinkDB
 */
var connection;

db.then((conn) => {
    connection = conn;

    /**
     * Listen for new records in the database and
     * notify users through a Socket.IO event
     */
    r.table('messages').changes().run(connection, (err, cursor) => {
        cursor.each((err, row) => {
            var { from, target } = row.new_val;

            // Send new messages to both sender and target
            app.get('socketService').emit(from, target, 'received message', row);
    	});
    });

    /**
     * Get the last 30 records from the 'messages' table 
     * where the user's id is  either in the 'from' field 
     * or the 'target' field, and the opposite field is the 
     * target's user id.
     */
    router.get('/messages', (req, res) => {
        var { from, target, offset } = req.query;

        var filter = ((r.row('from').eq(from).and(r.row('target').eq(target))).or((r.row('from').eq(target).and(r.row('target').eq(from)))));

        r.table('messages').filter(filter).slice(offset || 0).limit(30).run(connection, (err, cursor) => {
            cursor.toArray((err, results) => {
                if (err) throw err;
                res.status(200).json(results);
            });
        });
    });

    /**
     * Insert a new record in the 'messages' table
     */
    router.post('/messages', (req, res) => {
        // Get both participants UID and the message itself from request body
        var { from, target, message } = req.body;
    
        r.table('messages').insert({
            from,
            target,
            message,
        }).run(connection);
    
        res.status(201).end();
    });
    
    /**
     * Update a record in the 'messages' table
     */
    router.patch('/messages', (req, res) => {
        // Get the ID of the message to update and the new content from request body
        var { id, message } = req.body;
    
        r.table('messages').get(id).update({message}).run(connection);

        res.status(200).end();
    });
    
    /**
     * Delete a record in the 'messages' table
     */
    router.delete('/messages', (req, res) => {
        // Get the ID of the message to delete
        var { id } = req.body;
    
        r.table('messages').get(id).delete().run(connection);

        res.status(200).end();
    });
});

module.exports = { app };