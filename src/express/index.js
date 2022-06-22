var express = require('express');
var app = express();

require('dotenv').config();


var router = require('./router');

app.use('/api', router);

app.listen(process.env.PORT);
