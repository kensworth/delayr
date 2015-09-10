var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    util = require('util');

function JobSchema() {
    Schema.apply(this, arguments);

    this.add({
        to: String,
        subject: String,
        body: String,
        processed: {type: Boolean, default: false}
    });
}
util.inherits(JobSchema, Schema);

var jobSchema = new JobSchema();

jobSchema.virtual('type').get(function() {
    return this.__t;
});

var Job = mongoose.model('Job', jobSchema);

function extendJob(name, schema) {
    var newJobSchema = new JobSchema(schema);

    return Job.discriminator(name, newJobSchema);
}

exports.model = Job;
exports.extend = extendJob;