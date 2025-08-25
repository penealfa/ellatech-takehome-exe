import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../roles/entity/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // Hashed

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];
}