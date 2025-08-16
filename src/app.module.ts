// imports
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AppService } from './app.service';
import { OtpModule } from './otp/otp.module';
import { KycModule } from './kyc/kyc.module';
import { LoanModule } from './loan/loan.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmiReminderModule } from './cron/emi.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RolesGuard } from './common/guards/roles.guard';
import { UploadsModule } from './uploads/uploads.module';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductionGuard } from './middleware/production.guard';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '5432')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: false,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UsersModule,
    KycModule,
    UploadsModule,
    OtpModule,
    EmiReminderModule,
    AdminModule,
    LoanModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {}
}
