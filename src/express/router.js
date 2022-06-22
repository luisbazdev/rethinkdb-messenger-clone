var express = require('express');

var rethinkdb = require('rethinkdb');

var db = rethinkdb.connect({db: process.env.DATABASE});

var router = express.Router();

// Work on this
router.get('/messages', (req, res) => {
    var { from, target } = req.body;

    db.then((conn) => {
        rethinkdb.table('messages').filter({from, target}).limit(15).run(conn, (err, cursor) => {
            // Return the cursor here
        });
    });
})

router.post('/messages', (req, res) => {
    var { from, target, message } = req.body;

    db.then((conn) => {
        rethinkdb.table('messages').insert({
            from,
            target,
            message,
        }).run(conn);
    });

    res.status(201).end();
})

router.patch('/messages', (req, res) => {
    var { id, message } = req.body;

    db.then((conn) => {
        rethinkdb.table('messages').get(id).update(message).run(conn);
    });
})

router.delete('/messages', (req, res) => {
    var { id } = req.body;

    db.then((conn) => {
        rethinkdb.table('messages').get(id).delete().run(conn);
    });
})

module.exports = router;