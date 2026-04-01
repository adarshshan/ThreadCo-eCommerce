import { connectToDatabase } from "../config/database";
import { OrderDocument, OrderModel } from "../models/OrderSchema";

export interface IOrderRepository {
  findAll(): Promise<OrderDocument[]>;
  findById(id: string): Promise<OrderDocument | null>;
}

export class OrderRepository implements IOrderRepository {
  constructor() {
    // Ensure database connection
    connectToDatabase();
  }
  async findAll(): Promise<OrderDocument[]> {
    return (await OrderModel.find().exec()) as OrderDocument[];
  }
  async findById(id: string): Promise<OrderDocument | null> {
    try {
      return (await OrderModel.findById(id).exec()) as OrderDocument | null;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Order to ObjectId failed")
      ) {
        return null;
      }
      throw error;
    }
  }
}
