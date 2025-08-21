// Imports
import { MailJetService } from './mail.jet.service';
import { Controller, Post, Body } from '@nestjs/common';

@Controller('mail')
export class MailJetController {
  constructor(private readonly mailService: MailJetService) {}

  @Post('send')
  async send(
    @Body() body: { email: string; subject: string; message: string },
  ) {
    return this.mailService.sendMail(body.email, body.subject, body.message);
  }
}
