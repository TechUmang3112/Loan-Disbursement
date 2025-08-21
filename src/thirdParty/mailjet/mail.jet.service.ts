// Imports
import handlebars from 'handlebars';
import * as Mailjet from 'node-mailjet';
import { Injectable } from '@nestjs/common';
import { OTP_HTML } from '../../constants/strings';

@Injectable()
export class MailJetService {
  private mailjet: Mailjet.Client;

  constructor() {
    this.mailjet = new Mailjet.Client({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    });
  }

  async sendMail(to: string, subject: string, htmlContent: string) {
    const result = await this.mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_SENDER_EMAIL,
              Name: process.env.MAILJET_SENDER_NAME,
            },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: htmlContent,
          },
        ],
      });
    return result.body;
  }

  async sendOtpMail(to: string, otp: string, username?: string) {
    const template = handlebars.compile(OTP_HTML);
    const htmlWithVars = template({
      otp,
      username: username || 'User',
    });

    return this.sendMail(to, 'Your OTP Code - CashSnap', htmlWithVars);
  }
}
