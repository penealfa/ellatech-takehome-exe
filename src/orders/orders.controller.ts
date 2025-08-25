import { Controller, Post, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ResponseService } from '../response/response.service';
import { Permission } from '../permissions/permisssions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { OrderStatus } from './entity/order.entity';

@Controller('orders')
export class OrdersController {
    constructor(
        private ordersService: OrdersService,
        private responseService: ResponseService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permission('order.create')
    async create(@Req() req, @Body() dto: CreateOrderDto) {
        const data = await this.ordersService.create(req.user.userId, dto);
        return this.responseService.success(data, 'Order created');
    }

    @Get('transactions')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permission('transaction.view')
    async getTransactions() {
        const data = await this.ordersService.getAll();
        return this.responseService.success(data);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permission('order.update')
    async updateStatus(@Param('id') id: number, @Body('status') status: OrderStatus) {
        const data = await this.ordersService.updateStatus(id, status);
        return this.responseService.success(data, 'Status updated');
    }

    @Get(':id/status')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permission('order.status')
    async getOrderStatus(@Param('id') id: number) {
        const data = await this.ordersService.getOrderStatus(id);
        return this.responseService.success(data);
    }
}