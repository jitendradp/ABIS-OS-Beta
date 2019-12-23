import {config} from "../config";

var nodemailer = require('nodemailer');

export class Mailer {
    public static sendMail(to:string, subject:string, text:string, html:string) : Promise<void> {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport('smtps://' + config.smtpUser  + ':' + config.smtpPassword  + '@' + config.smtpServer);
        return new Promise(((resolve, reject) => {
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: config.smtpSender, //'"Fred Foo ?" <foo@blurdybloop.com>',
                to: to, //'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
                subject: subject, // 'Hello ✔', // Subject line
                text: text, //'Hello world ?', // plaintext body
                html: html // '<b>Hello world ?</b>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                error ? reject(error) : resolve();
            });
        }));
    }
}
