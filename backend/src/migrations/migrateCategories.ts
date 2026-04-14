import mongoose from "mongoose";
import { ProductModel } from "../models/productsSchema";
import { connectToDatabase } from "../config/database";

const migrate = async () => {
  try {
    await connectToDatabase();
    console.log("Connected to database for migration...");

    const products = await ProductModel.find({
      $or: [
        { categories: { $exists: false } },
        { categories: { $size: 0 } }
      ],
      category: { $exists: true }
    });

    console.log(`Found ${products.length} products to migrate.`);

    for (const product of products) {
      if (product.category) {
        product.categories = [product.category];
        await product.save();
        console.log(`Migrated product: ${product.name}`);
      }
    }

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
