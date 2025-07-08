import { connectToDatabase } from "../config/database";
import { ProductDocument, ProductModel } from "../models/productsSchema";

export interface IProductRepository {
  findAll(): Promise<ProductDocument[]>;
  findById(id: string): Promise<ProductDocument | null>;
  create(product: Omit<ProductDocument, "_id">): Promise<ProductDocument>;
  update(
    id: string,
    product: Partial<ProductDocument>
  ): Promise<ProductDocument | null>;
  delete(id: string): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
  constructor() {
    // Ensure database connection
    connectToDatabase();
  }

  async findAll(): Promise<ProductDocument[]> {
    return (await ProductModel.find().exec()) as ProductDocument[];
  }

  async findById(id: string): Promise<ProductDocument | null> {
    try {
      return (await ProductModel.findById(id).exec()) as ProductDocument | null;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Cast to ObjectId failed")
      ) {
        return null; // Handle invalid ObjectId gracefully
      }
      throw error;
    }
  }

  async create(product: ProductDocument): Promise<ProductDocument> {
    const newProduct = new ProductModel(product);
    return (await newProduct.save()) as ProductDocument;
  }

  async update(
    id: string,
    productData: Partial<ProductDocument>
  ): Promise<ProductDocument | null> {
    try {
      return (await ProductModel.findByIdAndUpdate(
        id,
        { $set: productData },
        { new: true }
      ).exec()) as ProductDocument | null;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Cast to ObjectId failed")
      ) {
        return null; // Handle invalid ObjectId gracefully
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await ProductModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Cast to ObjectId failed")
      ) {
        return false; // Handle invalid ObjectId gracefully
      }
      throw error;
    }
  }
}
