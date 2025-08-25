import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ResponseModule } from 'src/response/response.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),ResponseModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {}