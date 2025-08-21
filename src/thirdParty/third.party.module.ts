// Imports
import { Module } from '@nestjs/common';
import { MailJetModule } from './mailjet/mail.jet.module';

@Module({ imports: [MailJetModule], exports: [MailJetModule] })
export class ThirdPartyModule {}
