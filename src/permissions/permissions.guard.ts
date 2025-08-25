import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../users/entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private dataSource: DataSource,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission = this.reflector.get<string>(
            'permission',
            context.getHandler(),
        );
        if (!requiredPermission) return true;

        const request = context.switchToHttp().getRequest();
        const user: User = request.user; // From JWT
        

        if (!user) throw new ForbiddenException('No user');

        console.log(user.id)
        console.log(user)
        console.log(requiredPermission)
        const hasPerm = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .leftJoinAndSelect('role.permissions', 'permission')
            .where('user.id = :id', { id: user.id })
            .andWhere('permission.name = :perm', { perm: requiredPermission })
            .getOne();

        if (!hasPerm) throw new ForbiddenException('Insufficient permissions');
        return true;
    }
}
