var mail = require('../utils/mail'),
    createIcs = require('../utils/calendar');

function processJob(job) {
    switch(job.type) {
    case 'TimeJob':
        processTimeJob(job);
        break;
    case 'CalJob':
        processCalJob(job);
        break;
    }
}

function processTimeJob(timeJob) {
    if (timeJob.sendTime < new Date()) {
        return mail.sendEmailTo(timeJob.to, timeJob.subject, timeJob.body)
        .then(function() {
            return markJobAsProcessed(timeJob);
        });
    }
}

function processCalJob(calJob) {
    return mail.sendEmailTo(calJob.to, calJob.subject, calJob.body, {
        content: createIcs(calJob.subject, calJob.body, calJob.eventTime),
        filename: 'event.ics',
        contentType: 'text/calendar'
    })
    .then(function() {
        return markJobAsProcessed(calJob);
    });
}

function markJobAsProcessed(job) {
    job.processed = true;

    return job.save();
}

module.exports = processJob;