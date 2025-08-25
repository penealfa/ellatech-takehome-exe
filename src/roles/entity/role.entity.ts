import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Permission } from '../../permissions/entity/permissions.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., 'admin', 'user'

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}