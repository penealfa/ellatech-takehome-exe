import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permissions.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.services';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]),ResponseModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}