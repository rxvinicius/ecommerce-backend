import {
  Controller,
  Get,
  Post,
  Put,
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
@ApiTags('Products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista retornada com sucesso' })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<{ data: ProductResponse[]; meta: PaginationMeta }> {
    return this.productsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ProductResponse> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAccessGuard)
  @RequiredRole(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', MAX_PRODUCT_IMAGES))
  @ApiOperation({ summary: 'Criar novo produto (admin)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
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
  @ApiOperation({ summary: 'Atualizar produto (admin)' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponse> {
    return this.productsService.update(id, dto, files);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desativar produto (admin)' })
  @ApiResponse({ status: 200, description: 'Produto desativado com sucesso' })
  deactivate(@Param('id') id: string) {
    return this.productsService.deactivate(id);
  }
}
