import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entity/user.entity';
import { Role } from '../roles/entity/role.entity';
import { Permission } from '../permissions/entity/permissions.entity';
import * as bcrypt from 'bcrypt';
import { Reflector } from '@nestjs/core';

// Import all controllers to scan for permissions
import { UsersController } from '../users/users.controller';
import { ProductsController } from '../products/products.controller';
import { OrdersController } from '../orders/orders.controller';
import { AuthController } from '../auth/auth.controller';
import { RolesController } from '../roles/roles.controller';
import { PermissionsController } from '../permissions/permissions.controller';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly reflector = new Reflector();

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedPermissions();
    await this.assignPermissionsToAdmin();
    await this.seedAdminUser();
  }

  private async seedRoles() {
    const roles = ['admin', 'user'];
    for (const name of roles) {
      let role = await this.roleRepo.findOne({ where: { name } });
      if (!role) {
        role = this.roleRepo.create({ name });
        await this.roleRepo.save(role);
      }
    }
  }

  private async seedPermissions() {
    const permissions = this.collectPermissionsFromControllers();
    for (const name of permissions) {
      let perm = await this.permissionRepo.findOne({ where: { name } });
      if (!perm) {
        perm = this.permissionRepo.create({ name });
        await this.permissionRepo.save(perm);
      }
    }
  }

  private async assignPermissionsToAdmin() {
    const adminRole = await this.roleRepo.findOne({ where: { name: 'admin' }, relations: ['permissions'] });
    if (!adminRole) return;

    const allPermissions = await this.permissionRepo.find();
    adminRole.permissions = allPermissions;
    await this.roleRepo.save(adminRole);
  }

  private async seedAdminUser() {
    let adminUser = await this.userRepo.findOne({ where: { username: 'admin' }, relations: ['roles'] });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      adminUser = this.userRepo.create({
        username: 'admin',
        password: hashedPassword,
      });
    }

    const adminRole = await this.roleRepo.findOne({ where: { name: 'admin' } });
    if (adminRole) {
      adminUser.roles = [adminRole];
    }

    await this.userRepo.save(adminUser);
  }

  private collectPermissionsFromControllers(): string[] {
    const controllers = [
      UsersController,
      ProductsController,
      OrdersController,
      AuthController,
      RolesController,
      PermissionsController,
      // Add new controllers here when created
    ];

    const permissions = new Set<string>();

    for (const controller of controllers) {
      const proto = controller.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (typeof proto[key] === 'function') {
          const perm = this.reflector.get<string>('permission', proto[key]);
          if (perm) {
            permissions.add(perm);
          }
        }
      }
    }

    return Array.from(permissions);
  }
}