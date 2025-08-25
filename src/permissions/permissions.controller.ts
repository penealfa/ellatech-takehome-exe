import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.services';
import { ResponseService } from '../response/response.service';
import { Permission } from './permisssions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from './permissions.guard';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private permissionsService: PermissionsService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('permission.view')
  async getAll() {
    const data = await this.permissionsService.getAll();
    return this.responseService.success(data);
  }
}