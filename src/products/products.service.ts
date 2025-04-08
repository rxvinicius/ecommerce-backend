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
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginationMeta } from 'src/shared/types/pagination-meta.type';

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

  async findAll({ page, limit }: PaginationDto): Promise<{
    data: ProductResponse[];
    meta: PaginationMeta;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [total, products] = await this.prisma.$transaction([
        this.prisma.product.count({ where: { isActive: true } }),
        this.prisma.product.findMany({
          where: { isActive: true },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const lastPage = Math.ceil(total / limit);

      return {
        data: products,
        meta: { total, page, limit, lastPage },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: string): Promise<ProductResponse> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id, isActive: true },
      });

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

  async update(
    id: string,
    dto: UpdateProductDto,
    files: Express.Multer.File[] = [],
  ): Promise<ProductResponse> {
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

      // Parse imagesToRemove from JSON string
      let imagesToRemove: string[] = [];
      if (dto.imagesToRemove) {
        try {
          imagesToRemove = JSON.parse(dto.imagesToRemove);
        } catch {
          throw new BadRequestException('Invalid format for imagesToRemove');
        }
      }

      // 1. Generate final image list: removes the ones deleted and adds the new ones (if any)
      let currentImages = product.images.filter(
        (url) => !imagesToRemove.includes(url),
      );

      if (files.length > 0) {
        const uploadedUrls = await this.uploadImages(files);
        currentImages = [...currentImages, ...uploadedUrls];
      }

      // 2. Remove imagesToRemove from DTO before saving to DB
      const { imagesToRemove: _, ...safeDto } = dto;

      // 3. Update the product with the final image list
      const updated = await this.prisma.product.update({
        where: { id },
        data: {
          ...safeDto,
          images: currentImages,
        },
      });

      // 4. After successful DB update, delete removed images from Cloudinary
      if (imagesToRemove.length > 0) {
        await Promise.all(
          imagesToRemove.map((url) => {
            const publicId = this.extractPublicId(url);
            return cloudinary.uploader.destroy(publicId, {
              resource_type: 'image',
            });
          }),
        );
      }

      return updated;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error('Failed to update product:', error);
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  private extractPublicId(imageUrl: string): string {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts.at(-1);
      const folder = pathParts.at(-2);
      return `${folder}/${fileName?.split('.')[0]}`;
    } catch {
      throw new BadRequestException('Invalid image URL');
    }
  }

  async deactivate(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
