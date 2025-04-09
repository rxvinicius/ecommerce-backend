import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiProperty({ example: 'prod-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

class CardDto {
  @ApiProperty({ example: '1234 5678 9012 3456' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12/25' })
  @IsString()
  @IsNotEmpty()
  expiry: string;
}

export class CreateOrderBodyDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @IsPositive()
  total: number;

  @ApiProperty({ type: CardDto })
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
}
