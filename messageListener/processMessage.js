var Promise = require('bluebird'),
    _ = require('lodash'),
    delayParser = require('../extractors/delayParser/emailParse'),
    receiptParser = require('../extractors/receiptParser/extractor'),
    TimeJob = require('../models/TimeJob'),
    CalJob = require('../models/CalJob');

function commandMatchesDelay(text) {
    return _.reduce(['send', 'return', 'remind'], function(result, keyword) {
        return result || text.indexOf(keyword) === 0;
    }, false);
}

function extractEventFrom(messageData) {
    return new Promise(function(resolve, reject) {
        if (commandMatchesDelay(messageData.bodyPlain)) {
            resolve(delayParser(messageData));
        } else if (messageData.bodyPlain.indexOf('calendar') === 0) {
            resolve(receiptParser(messageData));
        }
    });
};

module.exports = function(messageData) {
    return extractEventFrom(messageData)
    .then(function(event) {
        console.log(event);

        var newJob;

        switch (event.type) {
        case 'TIME':
            newJob = new TimeJob({
                sendTime: event.time,
                to: event.to,
                subject: event.subject,
                body: event.body
            });
            break;
        case 'CAL':
            newJob = new CalJob({
                eventTime: event.time,
                to: event.to,
                subject: event.subject,
                body: event.body
            });
            break;
        }
        
        return newJob.save();
    });
};