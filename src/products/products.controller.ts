import { Controller, Post, Put, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustProductDto } from './dto/adjust-product.dto';
import { ResponseService } from '../response/response.service';
import { Permission } from '../permissions/permisssions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private responseService: ResponseService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('product.create')
  async create(@Body() dto: CreateProductDto) {
    const data = await this.productsService.create(dto);
    return this.responseService.success(data, 'Product created');
  }

  @Put('adjust/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('product.adjust')
  async adjust(@Param('id') id: number, @Body() dto: AdjustProductDto) {
    const data = await this.productsService.adjust(id, dto);
    return this.responseService.success(data, 'Quantity adjusted');
  }

  @Get('status/:id')
  @UseGuards(JwtAuthGuard)
  @Permission('product.status')
  async getStatus(@Param('id') id: number) {
    const data = await this.productsService.getStatus(id);
    return this.responseService.success(data);
  }
}