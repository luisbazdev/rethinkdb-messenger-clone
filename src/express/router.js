var rethinkdb = require('rethinkdb');
var express = require('express');

var db = require('./db');

module.exports = router = express.Router();

var connection;

/**
 * Try to connect to RethinkDB
 */
db.then((conn) => {
    connection = conn;

    /**
     * Listen for new records in the database and
     * notify users through a Socket.IO event
     */
    router.post('/changes', (req, res) => {
        // Get both participants UID from request body
        var { from, target } = req.body;
        
        // Initialize a changefeed in the 'messages' table and query
        // record where either the current user's UID is the sender or
        // the target, and the opposite side is 'target'
        rethinkdb.table('messages').filter({...}).changes().run(connection, (err, cursor) => {
            cursor.each((err, row) => {
                // Send new messages to both sender and target
                req.app.get('socketService').emit(from, target, 'received message', row);
        	});
        });

        res.status(200).end();
    })

    /**
     * Insert a new record in the 'messages' table
     */
    router.post('/messages', (req, res) => {
        // Get both participants UID and the message itself from request body
        var { from, target, message } = req.body;
    
        db.table('messages').insert({
            from,
            target,
            message,
        }).run(connection);
    
        res.status(201).end();
    });
    
    /**
     * Edit a record in the 'messages' table
     */
    router.patch('/messages', (req, res) => {
        // Get the ID of the message to update and the new content from request body
        var { id, message } = req.body;
    
        db.table('messages').get(id).update({message}).run(connection);

        res.status(200).end();
    });
    
    /**
     * Delete a record in the 'messages' table
     */
    router.delete('/messages', (req, res) => {
        // Get the ID of the message to delete
        var { id } = req.body;
    
        db.table('messages').get(id).delete().run(connection);

        res.status(200).end();
    });
});
