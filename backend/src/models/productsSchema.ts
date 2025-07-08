import { Schema, model, Document } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  price: number;
  description: string;
  stock: number;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export const ProductModel = model<ProductDocument>("Product", productSchema);
