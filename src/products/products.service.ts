import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponse } from './dto/product.response';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private notFoundMsg = 'Product not found';

  async findAll(): Promise<ProductResponse[]> {
    try {
      const products = await this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return products;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: string): Promise<ProductResponse> {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundException(this.notFoundMsg);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  async create(
    dto: CreateProductDto,
    userId: string,
  ): Promise<ProductResponse> {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...dto,
          createdById: userId,
        },
      });

      return product;
    } catch (error) {
      throw new BadRequestException('Failed to create product');
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponse> {
    try {
      if (!dto || Object.keys(dto).length === 0) {
        throw new BadRequestException('No fields provided for update');
      }

      if (Object.values(dto).some((value) => value === null)) {
        throw new BadRequestException('Null values are not allowed');
      }

      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(this.notFoundMsg);
      }

      const updated = await this.prisma.product.update({
        where: { id },
        data: dto,
      });

      return updated;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(this.notFoundMsg);
      }

      await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
