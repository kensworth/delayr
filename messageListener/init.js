var express = require('express'),
    bodyParser = require('body-parser'),
    Promise = require('bluebird'),
    mongoose = Promise.promisifyAll(require('mongoose')),
    processMessage = require('./processMessage'),
    config = require('../utils/envVars'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.DB_URL);
var db = mongoose.connection;

db.once('open', function() {
    app.post('/messages', function(req, res) {
        var messageData = {
            from: req.body.sender,
            subject: req.body.subject,
            bodyHtml: req.body['body-html'],
            bodyPlain: req.body['body-plain']
        };

        processMessage(messageData)
        .then(function(savedJob) {
            res.sendStatus(200);
        });
    });

    app.listen(process.env.PORT || 1337);
});