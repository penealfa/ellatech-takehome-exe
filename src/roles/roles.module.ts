import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Permission } from '../permissions/entity/permissions.entity';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]),ResponseModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}