// src/seeder/seeder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '../users/entity/user.entity';
import { Role } from '../roles/entity/role.entity';
import { Permission } from '../permissions/entity/permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}