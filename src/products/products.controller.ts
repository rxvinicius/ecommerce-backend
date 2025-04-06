import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from 'src/shared/constants/roles.enum';
import { RoleAccessGuard } from 'src/access-control/guards/role-access.guard';
import { RequiredRole } from 'src/access-control/decorators/required-role.decorator';
import { RequestWithUser } from 'src/types/request-with-user';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponse } from './dto/product.response';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<ProductResponse[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductResponse> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.ADMIN)
  async create(
    @Body() dto: CreateProductDto,
    @Request() req: RequestWithUser,
  ): Promise<ProductResponse> {
    const user = req.user;
    return this.productsService.create(dto, user.sub);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.ADMIN)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.ADMIN)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.productsService.remove(id);
  }
}
