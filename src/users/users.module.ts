import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '../roles/entity/role.entity';
import { Permission } from '../permissions/entity/permissions.entity';
import { RolesModule } from '../roles/roles.module';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), RolesModule,ResponseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}