import {EmailTemplate} from 'email-templates';
import nodemailer from 'nodemailer';
import _ from 'lodash';
import path from 'path';

var viewsDir = path.join(__dirname, 'emails');

//TODO environ configurable?
export var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gmail.user@gmail.com',
    pass: 'userpass'
  }
});

export var COMMON_CONTEXT = {
  //TODO server address, website name, from
}

export function sendMail(viewName, context) {
  return new Promise(function(resolve, reject) {
    context = _.merge({}, context, COMMON_CONTEXT);
    var emailView = new EmailTemplate(path.join(viewsDir, viewName));
    emailView.render(context, function(err, results) {
      if(err) return reject(err);
      transporter.sendMail({
          from: process.env.EMAIL_ADDRESS || 'sender@address',
          to: context.email,
          subject: context.subject || 'hello',
          text: results.text,
          html: results.html,
      }, function(error, info) {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      });
    });
  });
}
