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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
import { AdminOrderResponse } from './dto/admin-order.response';

@Controller('orders')
@ApiTags('Orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create a new order (Customer only)' })
  @ApiResponse({ status: 201, type: OrderResponse })
  async create(
    @Body() dto: CreateOrderBodyDto,
    @Request() req: RequestWithUser,
  ): Promise<OrderResponse> {
    return this.ordersService.create(dto, req.user.sub);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get orders for a specific user (Customer only)' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: [OrderResponse],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          lastPage: 1,
        },
      },
    },
  })
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() pagination: PaginationDto,
  ): Promise<{ data: OrderResponse[]; meta: PaginationMeta }> {
    return this.ordersService.findByUser(userId, pagination);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: [AdminOrderResponse],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          lastPage: 1,
        },
      },
    },
  })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ data: AdminOrderResponse[]; meta: PaginationMeta }> {
    return this.ordersService.findAll(pagination);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiResponse({ status: 200, type: OrderResponse })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponse> {
    return this.ordersService.findOne(id);
  }
}
