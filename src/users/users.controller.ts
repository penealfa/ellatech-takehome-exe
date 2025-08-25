import { Controller, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { ResponseService } from '../response/response.service';
import { Permission } from '../permissions/permisssions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private responseService: ResponseService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('user.create')
  async create(@Body() dto: CreateUserDto) {
    const data = await this.usersService.create(dto);
    return this.responseService.success(data, 'User created');
  }

  @Put(':userId/roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('user.assign_role')
  async assignRoles(@Param('userId') userId: number, @Body() dto: AssignRolesDto) {
    const data = await this.usersService.assignRoles(userId, dto);
    return this.responseService.success(data, 'Roles assigned');
  }
}