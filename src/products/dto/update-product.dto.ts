import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsArray,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Novo nome do produto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Descrição atualizada' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 499.99 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    example: '["https://image1.jpg", "https://image2.jpg"]',
  })
  @IsOptional()
  @IsString()
  imagesToRemove?: string;
}
