var _ = require('lodash'),
    Promise = require('bluebird'),
    mongoose = Promise.promisifyAll(require('mongoose')),
    Job = require('../models/Job').model,
    processJob = require('./processJob');

var each = _.curry(function(func, collection) {
    _.each(collection, func);
});

setInterval(function() {
    Job.find({processed: false})
    .then(each(processJob));
}, 5000);