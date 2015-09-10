//syntax: returnSyntax.txt
require('./sugar-date');
var Knwl = require('./knwl');

function parse(messageData) {
	var knwlInstance = new Knwl('english');

	var email = messageData.bodyPlain;
	var lines = email.split('\r');
	var command = lines[0];
	lines.splice(0,1);
	var emailBody = lines.join('\n');

	knwlInstance.init(command);
	var emails = knwlInstance.get('emails');
	var recipient = emails.length > 0 ? emails[0].address : messageData.from;
	if (command.search(" at ") >= 0) {
		var timeSplit = command.split(" at ");
		var timeSend = timeSplit[1];
	}
	else if (command.search(" in ") >= 0) {
		var timeSplit = command.split(" in ");
		var timeSend = "in " + timeSplit[1];
	}
	else if (command.search(" now") >= 0) {
		var timeSend = "now";
	}
	else {
		console.log("No specified date.")
	}
	var timeSendPDT = Date.create(timeSend)/*.advance({ hours: 3 })*/;
	var newData = {
		to: recipient,
		subject: messageData.subject,
		time: timeSendPDT,
		body: emailBody,
		type: 'TIME'
	}
	
	return newData;
}

module.exports = parse;