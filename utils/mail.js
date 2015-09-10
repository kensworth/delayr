var Promise = require('bluebird'),
    request = require('request'),
    config = require('./envVars');

exports.sendEmailTo = function(to, subject, body, attachment) {
    var requestData = {
            auth: {
                user: 'api',
                pass: config.MG_KEY
            },
        },
        formData = {
            from: config.MG_EMAIL,
            to: to,
            subject: subject,
            html: body
        };

    if (attachment) {
        formData.attachment = {
            value: new Buffer(attachment.content),
            options: {
                filename: attachment.filename,
                contentType: attachment.contentType
            }
        };
        requestData.formData = formData;
    } else {
        requestData.form = formData;
    }
    console.log(requestData);
    return new Promise(function(resolve, reject) {
        request.post(config.MG_API_URL + '/messages', requestData, function(err, res, body) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                if (res.statusCode > 399) {
                    console.log('error sending message ', res.statusCode, body);
                    reject();
                } else {
                    console.log('email sent with status ', res.statusCode, body);
                    resolve();
                }
            }
        });
    });
};