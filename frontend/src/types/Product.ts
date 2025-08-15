export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  image?: File | string | undefined | null;
  createdAt: string;
  updatedAt: string;
}
