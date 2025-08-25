import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Permission } from '../permissions/entity/permissions.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    // Fetch permissions by IDs
    const permissions = await this.permissionRepo.findByIds(dto.permIds);

    if (!permissions || permissions.length === 0) {
      throw new NotFoundException('No valid permissions found for the provided IDs');
    }

    // Create role with associated permissions
    const role = this.roleRepo.create({
      name: dto.name,
      permissions, // link permissions
    });

    return this.roleRepo.save(role);
  }
}
