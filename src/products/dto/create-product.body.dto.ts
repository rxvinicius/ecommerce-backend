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
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;
}
