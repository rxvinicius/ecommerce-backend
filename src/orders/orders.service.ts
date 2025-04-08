import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginationMeta } from 'src/shared/types/pagination-meta.type';
import { CreateOrderBodyDto } from './dto/create-order.body.dto';
import { OrderResponse } from './dto/order.response';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateOrderBodyDto,
    userId: string,
  ): Promise<OrderResponse> {
    try {
      const order = await this.prisma.order.create({
        data: {
          userId,
          total: dto.total,
          cardName: dto.card.name.trim().toUpperCase(),
          cardNumber: dto.card.number.trim().toUpperCase(),
          cardExpiry: dto.card.expiry.trim().toUpperCase(),
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new BadRequestException('Error creating order');
    }
  }

  async findAll({ page, limit }: PaginationDto): Promise<{
    data: OrderResponse[];
    meta: PaginationMeta;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [total, orders] = await this.prisma.$transaction([
        this.prisma.order.count(),
        this.prisma.order.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        }),
      ]);

      return {
        data: orders,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error searching for order:', error);
      throw new InternalServerErrorException('Error searching for order');
    }
  }

  async findByUser(
    userId: string,
    { page, limit }: PaginationDto,
  ): Promise<{
    data: OrderResponse[];
    meta: PaginationMeta;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [total, orders] = await this.prisma.$transaction([
        this.prisma.order.count({ where: { userId } }),
        this.prisma.order.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        }),
      ]);

      return {
        data: orders,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error searching for user order:', error);
      throw new InternalServerErrorException('Error searching for user order');
    }
  }

  async findOne(id: string): Promise<OrderResponse> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!order) throw new NotFoundException('Order not found');

      return order;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error searching for order:', error);
      throw new InternalServerErrorException('Error searching for order');
    }
  }
}
