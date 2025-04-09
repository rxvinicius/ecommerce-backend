import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponse {
  @ApiProperty({ example: 'item-uuid-1' })
  id: string;

  @ApiProperty({ example: 'prod-uuid-1234' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;
}

export class OrderResponse {
  @ApiProperty({ example: 'order-uuid-123' })
  id: string;

  @ApiProperty({ example: 'user-uuid-1' })
  userId: string;

  @ApiProperty({ example: 199.99 })
  total: number;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @ApiProperty({ example: 'JOÃO DA SILVA' })
  cardName: string;

  @ApiProperty({ example: '1234 5678 9012 3456' })
  cardNumber: string;

  @ApiProperty({ example: '12/25' })
  cardExpiry: string;

  @ApiProperty({ type: [OrderItemResponse] })
  items: OrderItemResponse[];
}
