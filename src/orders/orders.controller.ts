import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/shared/types/request-with-user';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginationMeta } from 'src/shared/types/pagination-meta.type';
import { RequiredRole } from 'src/access-control/decorators/required-role.decorator';
import { RoleAccessGuard } from 'src/access-control/guards/role-access.guard';
import { UserRole } from 'src/shared/constants/roles.enum';

import { OrdersService } from './orders.service';
import { CreateOrderBodyDto } from './dto/create-order.body.dto';
import { OrderResponse } from './dto/order.response';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.CUSTOMER)
  async create(
    @Body() dto: CreateOrderBodyDto,
    @Request() req: RequestWithUser,
  ): Promise<OrderResponse> {
    return this.ordersService.create(dto, req.user.sub);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.CUSTOMER)
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() pagination: PaginationDto,
  ): Promise<{ data: OrderResponse[]; meta: PaginationMeta }> {
    return this.ordersService.findByUser(userId, pagination);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.ADMIN)
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ data: OrderResponse[]; meta: PaginationMeta }> {
    return this.ordersService.findAll(pagination);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponse> {
    return this.ordersService.findOne(id);
  }
}
