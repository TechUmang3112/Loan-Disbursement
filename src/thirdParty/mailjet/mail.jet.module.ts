// Imports
import { Module } from '@nestjs/common';
import { MailJetService } from './mail.jet.service';
import { MailJetController } from './mail.jet.controller';

@Module({
  controllers: [MailJetController],
  exports: [MailJetService],
  providers: [MailJetService],
})
export class MailJetModule {}
