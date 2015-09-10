module.exports = function(subject, emailBody, date) {

	var ics = require('ical-generator'),
		cal, calEvent;
    cal = ics({
        domain: 'yahoo.com',
        prodId: {company: 'Yahoo Inc.', product: 'Remindr'},
        name: 'YRemindr',
        timezone: 'PST'
    });

	calEvent = cal.createEvent({
	    start: new Date(time + 450000),
	    end: new Date(time + 460000),
	    summary: subject,
	    description: emailBody,
	    url: 'http://yahoo.com/'
	});

    return calEvent.toString();
};