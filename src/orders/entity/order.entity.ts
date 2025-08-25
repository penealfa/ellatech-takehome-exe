import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Product } from '../../products/entity/product.entity';

export enum OrderStatus {
  ORDERED = 'ordered',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ORDERED })
  status: OrderStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}