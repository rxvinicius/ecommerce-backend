import { ApiProperty } from '@nestjs/swagger';

export class AdminOrderItemProduct {
  @ApiProperty({ example: 'uuid-product-id' })
  id: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    type: [String],
  })
  images: string[];

  @ApiProperty({ example: 'Smartphone XYZ' })
  name: string;
}

export class AdminOrderItem {
  @ApiProperty({ example: 'uuid-item-id' })
  id: string;

  @ApiProperty({ example: 'uuid-product-id' })
  productId: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ type: () => AdminOrderItemProduct })
  product: AdminOrderItemProduct;
}

export class AdminOrderUser {
  @ApiProperty({ example: 'uuid-user-id' })
  id: string;

  @ApiProperty({ example: 'Maria Oliveira' })
  name: string;
}

export class AdminOrderResponse {
  @ApiProperty({ example: 'uuid-order-id' })
  id: string;

  @ApiProperty({ example: 'uuid-user-id' })
  userId: string;

  @ApiProperty({ type: () => AdminOrderUser })
  user: AdminOrderUser;

  @ApiProperty({ example: 399.99 })
  total: number;

  @ApiProperty({ example: '2024-01-01T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T12:10:00Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'MARIA OLIVEIRA' })
  cardName: string;

  @ApiProperty({ example: '1234 5678 9012 3456' })
  cardNumber: string;

  @ApiProperty({ example: '12/26' })
  cardExpiry: string;

  @ApiProperty({ type: () => [AdminOrderItem] })
  items: AdminOrderItem[];
}
