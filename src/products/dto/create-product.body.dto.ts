import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductBodyDto {
  @ApiProperty({ example: 'iPhone 14 Pro' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'Smartphone Apple com 128GB, 6.1", 5G, iOS' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: 7999.99 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;
}
