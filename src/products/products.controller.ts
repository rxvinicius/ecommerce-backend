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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleAccessGuard } from 'src/access-control/guards/role-access.guard';
import { RequiredRole } from 'src/access-control/decorators/required-role.decorator';
import { UserRole } from 'src/shared/constants/roles.enum';
import { RequestWithUser } from 'src/types/request-with-user';
import { MAX_PRODUCT_IMAGES } from 'src/config/upload.config';

import { ProductsService } from './products.service';
import { CreateProductBodyDto } from './dto/create-product.body.dto';
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
