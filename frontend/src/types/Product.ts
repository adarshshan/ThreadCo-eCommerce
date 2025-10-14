export interface Product {
  _id: string | number;
  name: string;
  price: number;
  description?: string;
  stock?: number;
  category?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}
