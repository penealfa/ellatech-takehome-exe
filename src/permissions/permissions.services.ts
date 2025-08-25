import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entity/permissions.entity';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private repo: Repository<Permission>) {}

  getAll() {
    return this.repo.find();
  }
}