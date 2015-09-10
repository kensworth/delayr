module.exports = function (messageData) {
	console.log(arguments);
  var cheerio = require('cheerio'),
  		regexDates = /([0-9]{2}\/[0-9]{2}\/[0-9]{4})/g,
			regexAmount = /(\$[0-9]+\.*[0-9]*)/g,
			dates = [],
			amount = [], 
			obj;

	try {
		$ = cheerio.load(messageData.bodyHtml);
		bodyText = $('body').text();
		dates = bodyText.match(regexDates);
		time = new Date(dates[0]).getTime();
		amount = bodyText.match(regexAmount);
		
		console.log(dates);
		console.log(amount);
		console.log('---------------------');

		obj = {
			to : messageData.from, 
			type : "CAL",
			subject : messageData.subject,
			body : messageData.bodyHtml,
			time : dates[0],
			amount : amount
		};

		return obj;

	} catch (e) {
		console.log('Regex must have failed');
		console.log(e);
	}
};
