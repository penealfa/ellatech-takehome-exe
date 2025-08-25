import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/entity/role.entity';
import { AssignRolesDto } from './dto/assign-roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    user.password = await bcrypt.hash(dto.password, 10);

    // Assign default role (e.g., 'user')
    const role = await this.roleRepo.findOne({ where: { name: 'user' } });
    if (role) user.roles = [role];

    return this.repo.save(user);
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username }, relations: ['roles', 'roles.permissions'] });
  }

  async assignRoles(userId: number, dto: AssignRolesDto) {
    const user = await this.repo.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) throw new NotFoundException('User not found');

    const roles = await this.roleRepo.findBy({ id: In(dto.roleIds) });
    if (roles.length !== dto.roleIds.length) throw new NotFoundException('Some roles not found');

    user.roles = roles; // Replace existing roles; use push for append
    return this.repo.save(user);
  }

    findOne(id: number) {
    return this.repo.findOne({ where: { id }});
  }
}