import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { AdjustProductDto } from './dto/adjust-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  create(dto: CreateProductDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async adjust(id: number, dto: AdjustProductDto) {
    const product = await this.repo.findOneBy({ id });
    if (!product) throw new Error('Product not found');
    product.quantity += dto.adjustment;
    if (product.quantity < 0) product.quantity = 0;
    return this.repo.save(product);
  }

  getStatus(id: number) {
    return this.repo.findOneBy({ id }).then(p => ({
      status: p!.quantity > 0 ? 'in-stock' : 'out-of-stock',
      quantity: p!.quantity,
    }));
  }

  findByOne( pid: number)
  {
    return this.repo.findOneBy({ id: pid });
  }
}