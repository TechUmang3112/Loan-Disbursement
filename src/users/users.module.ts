// Imports
import { User } from './users.model';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { CryptoModule } from '../common/utils/crypto.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), CryptoModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, SequelizeModule],
})
export class UsersModule {}
