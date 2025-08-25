import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductsModule, UsersModule,ResponseModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}