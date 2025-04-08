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
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Query,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleAccessGuard } from 'src/access-control/guards/role-access.guard';
import { RequiredRole } from 'src/access-control/decorators/required-role.decorator';
import { UserRole } from 'src/shared/constants/roles.enum';
import { RequestWithUser } from 'src/shared/types/request-with-user';
import { MAX_PRODUCT_IMAGES } from 'src/config/upload.config';

import { ProductsService } from './products.service';
import { CreateProductBodyDto } from './dto/create-product.body.dto';
import { ProductResponse } from './dto/product.response';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginationMeta } from 'src/shared/types/pagination-meta.type';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ data: ProductResponse[]; meta: PaginationMeta }> {
    return this.productsService.findAll(pagination);
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
  @UseInterceptors(FilesInterceptor('images', MAX_PRODUCT_IMAGES))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateProductBodyDto,
    @Request() req: RequestWithUser,
  ): Promise<ProductResponse> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    return this.productsService.create(dto, files, req.user.sub);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', MAX_PRODUCT_IMAGES))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return this.productsService.update(id, dto, files);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.productsService.deactivate(id);
  }
}
