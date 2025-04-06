import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductBodyDto } from './dto/create-product.body.dto';
import { ProductResponse } from './dto/product.response';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private notFoundMsg = 'Product not found';

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploads: string[] = [];

    try {
      for (const file of files) {
        const bufferStream = Readable.from(file.buffer);

        const result: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );

          bufferStream.pipe(stream);
        });

        uploads.push(result.secure_url);
      }

      return uploads;
    } catch (error) {
      console.error('Erro ao fazer upload das imagens:', error);
      throw new BadRequestException('Failed to upload product images');
    }
  }

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
    dto: CreateProductBodyDto,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<ProductResponse> {
    try {
      const imageUrls = await this.uploadImages(files);

      const product = await this.prisma.product.create({
        data: {
          ...dto,
          images: imageUrls,
          createdById: userId,
        },
      });

      return product;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
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
