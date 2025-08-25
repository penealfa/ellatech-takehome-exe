import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../../roles/entity/role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., 'user.create'

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}