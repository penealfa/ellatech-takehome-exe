import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { use } from 'passport';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private repo: Repository<Order>,
        private productsService: ProductsService,
        private usersService: UsersService,
    ) { }

    async create(userId: number, dto: CreateOrderDto) {
        const user = await this.usersService.findOne(userId); // Use repo from UsersService if needed
        const product = await this.productsService.findByOne(dto.productId);
        if (!product || product.quantity < dto.quantity) throw new BadRequestException('Insufficient stock');

        if (!user) {
            throw new Error("User must not be null when creating an order");
        }

        const order = this.repo.create({
            user,
            product,
            quantity: dto.quantity,
            status: OrderStatus.ORDERED,
        });

        // Adjust product quantity
        await this.productsService.adjust(dto.productId, { adjustment: -dto.quantity });

        return this.repo.save(order);
    }

    getAll() {
        return this.repo.find({ relations: ['user', 'product'] });
    }

    async updateStatus(id: number, status: OrderStatus) {
        const order = await this.repo.findOneBy({ id });
        if (!order) throw new BadRequestException('Order not found');
        order.status = status;
        return this.repo.save(order);
    }
    
    async getOrderStatus(id: number) {
        const order = await this.repo.findOne({
            select: ['status'], // only select the status column
            where: { id },
        });

        if (!order) {
            return null; // or throw an exception if you prefer
        }

        return order.status;
    }

}