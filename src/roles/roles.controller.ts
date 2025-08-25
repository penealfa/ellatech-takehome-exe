import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ResponseService } from '../response/response.service';
import { Permission } from '../permissions/permisssions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private responseService: ResponseService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('role.create')
  async create(@Body() dto: CreateRoleDto) {
    const data = await this.rolesService.create(dto);
    return this.responseService.success(data, 'Role created');
  }
}