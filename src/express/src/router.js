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
    methods: ['GET', 'POST', 'PATCH']
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
            if(row.new_val.unsent === true){
                var { from, target } = row.new_val;

                row.new_val.unsentForAll === true 
                ? app.get('socketService').emit(from, target, 'unsent message', row)
                : app.get('socketService').emit(row.new_val.unsentFor[0], null, 'unsent message', row)
            }
            else{
                var { from, target } = row.new_val;
                
                // Notify both sender and receiver of a new message
                app.get('socketService').emit(from, target, 'received message', row);
            }  
    	});
    });

    /**
     * Get the last N records from the 'messages' table 
     * where the user's id is  either in the 'from' field 
     * or the 'target' field, and the opposite field is the 
     * target's user id.
     */
    router.get('/messages', (req, res) => {
        var { from, target, offset, limit, orderBy } = req.query;

        var filter = ( 
            ((r.row('from').eq(from).and(r.row('target').eq(target)))
            .or(r.row('from').eq(target).and(r.row('target').eq(from))))
            .and(r.row('unsentFor').contains(from).not())
        );

        // Make this cleaner
        if(orderBy == 'asc')
            r.table('messages')
            .filter(filter, {default: true})
            .slice(Number(offset) || 0)
            .orderBy('createdAt')
            .limit(Number(limit) || 30)
            .run(connection, (err, cursor) => {
                cursor.toArray((err, results) => {
                    if (err) throw err;
                    res.status(200).json(results);
                });
            });

        else
            r.table('messages')
            .filter(filter, {default: true})
            .slice(Number(offset) || 0)
            .orderBy(r.desc('createdAt'))
            .limit(Number(limit) || 30)
            .run(connection, (err, cursor) => {
                cursor.toArray((err, results) => {
                    if (err) throw err;
                    res.status(200).json(results);
                });
            });
    });

    /**
     * Get a message with the provided ID from the 'messages' table
     */
    router.get('/messages/:messageId', (req, res) => {
        var { messageId } = req.params

        r.table('messages').get(messageId).run(connection, (err, result) => {
            return res.status(200).json(result);
        })
    })

    /**
     * Insert a new record in the 'messages' table
     */
    router.post('/messages', (req, res) => {
        // Get both participants UID and the message itself from request body,
        // as well as file information (in case a file was sent by the user)
        var { from, target, message, file_path, file_ext } = req.body;
    
        if(!message)
            r.table('messages').insert({
                unsent: false,
                unsentFor: [],
                unsentForAll: false,
                unsentAt: null,
                from,
                target,
                file_path,
                file_ext,
                createdAt: new Date()
            }).run(connection);
            
        else
            r.table('messages').insert({
                unsent: false,
                unsentFor: [],
                unsentForAll: false,
                unsentAt: null,
                from,
                target,
                message,
                createdAt: new Date()
            }).run(connection);
    
        res.status(201).end();
    });
    
    /**
     * Update a record in the 'messages' table
     */
    router.patch('/messages/:messageId', (req, res) => {
        var { unsentFor } = req.query;

        // Get the ID of the message to delete
        var { messageId } = req.params;

        if(unsentFor === 'everyone')
            r.table('messages').get(messageId).update({
                unsent: true,
                unsentForAll: true, 
                unsentAt: new Date(), 
                message: null, 
                file_path: null, 
                file_ext: null
            }).run(connection);
            
        else
            r.table('messages').get(messageId).update({
                unsent: true,
                unsentFor: r.row('unsentFor').prepend(unsentFor)
            }).run(connection);

        res.status(200).end();
    });
});

module.exports = { app };