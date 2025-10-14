import axios from 'axios';
import type { Product } from '../types/Product';

const VITE_API_URL = import.meta.env.VITE_API_URL

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${VITE_API_URL}/products`);
  return response.data;
};

export const getProductsById = async (id: string): Promise<Product> => {
  const response = await axios.get(`${VITE_API_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  const response = await axios.post(`${VITE_API_URL}/products`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (productData: FormData): Promise<Product> => {
  const id = productData.get('_id') as string;
  const response = await axios.put(`${VITE_API_URL}/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`${VITE_API_URL}/products/${id}`);
};
