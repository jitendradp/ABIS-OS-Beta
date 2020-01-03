import {config} from "../config";
import {User} from "../generated";

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

    public static async sendEmailVerificationCode(user: User): Promise<void> {
        // TODO: Use proper mail template
        const txt = "";
        return Mailer.sendMail(user.email, "Your ABIS verification code", user.challenge, user.challenge);
    }

    public static async sendAccountReminder(user:User) : Promise<void> {
        // TODO: Use proper mail template
        const txt = "You already have an account at ABIS. " +
            "Simply use your email address and password to login." +
            "If you forgot your password, please use the 'Password reset' link on our login page:" +
            "https://!§$%&/()=?.com";
        return Mailer.sendMail(user.email, "Abis account reminder", txt, txt);
    }
}
