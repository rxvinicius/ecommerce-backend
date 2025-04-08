export class OrderItemResponse {
  id: string;
  productId: string;
  quantity: number;
}

export class OrderResponse {
  id: string;
  userId: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;

  cardName: string;
  cardNumber: string;
  cardExpiry: string;

  items: OrderItemResponse[];
}
