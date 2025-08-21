// Imports
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import { User } from '../users/users.model';
import { OtpModule } from '../otp/otp.module';
import AuthController from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { CryptoModule } from '../common/utils/crypto.module';
import { JwtStrategy } from '../middleware/jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailJetModule } from '../thirdParty/mailjet/mail.jet.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    OtpModule,
    PassportModule,
    SequelizeModule.forFeature([User]),
    CryptoModule,
    MailJetModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
