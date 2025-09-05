// imports
import { join } from 'path';
import { AppService } from './app.service';
import { EmiModule } from './emi/emi.module';
import { OtpModule } from './otp/otp.module';
import { KycModule } from './kyc/kyc.module';
import { ApiModule } from './api/api.module';
import { LoanModule } from './loan/loan.module';
import { AuthModule } from './auth/auth.module';
import { ApiV1Module } from './api/v1/v1.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmiReminderModule } from './cron/emi.module';
import { PaymentModule } from './payment/payment.module';
import { UploadsModule } from './uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { CryptoModule } from './common/utils/crypto.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule, Routes } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

const routes: Routes = [
  {
    path: '/api',
    module: ApiModule,
    children: [
      {
        path: 'v1',
        module: ApiV1Module,
        children: [
          {
            path: '',
            module: AuthModule,
          },
          {
            path: '',
            module: UsersModule,
          },
          {
            path: '',
            module: KycModule,
          },
          {
            path: '',
            module: UploadsModule,
          },
          {
            path: '',
            module: OtpModule,
          },
          {
            path: '',
            module: LoanModule,
          },
          {
            path: '',
            module: CryptoModule,
          },
          {
            path: '',
            module: EmiModule,
          },
          {
            path: '',
            module: PaymentModule,
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    module: AdminModule,
  },
];

@Module({
  imports: [
    RouterModule.register(routes),
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
    EmiReminderModule,
    ApiModule,
    AdminModule,
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
