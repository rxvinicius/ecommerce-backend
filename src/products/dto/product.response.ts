export class ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
}
