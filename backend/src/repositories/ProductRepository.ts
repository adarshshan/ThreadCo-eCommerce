import { connectToDatabase } from "../config/database";
import { ProductDocument, ProductModel } from "../models/productsSchema";

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
  sellerId?: string | any;
}

export interface IProductRepository {
  findAll(
    filters?: ProductFilters,
  ): Promise<{ products: ProductDocument[]; totalItems: number }>;
  findById(id: string): Promise<ProductDocument | null>;
  findRelatedProducts(
    productId: string,
    limit?: number,
  ): Promise<ProductDocument[]>;
  create(product: Omit<ProductDocument, "_id">): Promise<ProductDocument>;
  update(
    id: string,
    product: Partial<ProductDocument>,
  ): Promise<ProductDocument | null>;
  delete(id: string): Promise<boolean>;
  countAll(filters?: ProductFilters): Promise<number>;
}

export class ProductRepository implements IProductRepository {
  constructor() {
    // Ensure database connection
    connectToDatabase();
  }

  private normalizeProduct(product: any): ProductDocument | null {
    if (!product) return null;
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map((img: any) => {
        if (typeof img === "string") {
          return { url: img, public_id: "" };
        }
        return img;
      });
    }
    return product as ProductDocument;
  }

  async findRelatedProducts(
    productId: string,
    limit: number = 10,
  ): Promise<ProductDocument[]> {
    const product = await ProductModel.findById(productId)
      .select("category")
      .lean();
    if (!product) return [];

    const products = await ProductModel.find({
      category: product.category,
      _id: { $ne: productId },
      isActive: true,
    })
      .limit(limit)
      .populate("category", "name")
      .select("name price images category stock hasSizes sizes")
      .lean()
      .exec();

    return (
      products.map((p) => this.normalizeProduct(p)) as ProductDocument[]
    ).filter(Boolean);
  }

  async countAll(filters: ProductFilters = {}): Promise<number> {
    const query: any = { isActive: true };

    if (filters.category) query.category = filters.category;
    if (filters.sellerId) query.sellerId = filters.sellerId;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    if (filters.search) query.$text = { $search: filters.search };

    return await ProductModel.countDocuments(query);
  }

  async findAll(
    filters: ProductFilters = {},
  ): Promise<{ products: ProductDocument[]; totalItems: number }> {
    const query: any = { isActive: true };

    if (filters.category) query.category = filters.category;
    if (filters.sellerId) query.sellerId = filters.sellerId;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    if (filters.search) query.$text = { $search: filters.search };

    let sortOption: any = { createdAt: -1 };
    if (filters.sort) {
      switch (filters.sort) {
        case "price_asc":
          sortOption = { price: 1 };
          break;
        case "price_desc":
          sortOption = { price: -1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
      }
    }

    const totalItems = await ProductModel.countDocuments(query);

    const findQuery = ProductModel.find(query)
      .populate("category", "name")
      .populate("sellerId", "name email")
      .select(
        "_id name price images category stock hasSizes sizes sellerId weight description",
      )
      .sort(sortOption)
      .lean();

    if (filters.limit) {
      const page = filters.page || 1;
      const skip = (page - 1) * filters.limit;
      findQuery.skip(skip).limit(filters.limit);
    }

    const products = await findQuery.exec();
    return {
      products: (
        products.map((p) => this.normalizeProduct(p)) as ProductDocument[]
      ).filter(Boolean),
      totalItems,
    };
  }

  async findById(id: string): Promise<ProductDocument | null> {
    try {
      const product = await ProductModel.findById(id)
        .populate("category", "name")
        .lean()
        .exec();
      return this.normalizeProduct(product);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Cast to ObjectId failed")
      ) {
        return null;
      }
      throw error;
    }
  }

  async create(product: ProductDocument): Promise<ProductDocument> {
    const newProduct = new ProductModel(product);
    const savedProduct = await newProduct.save();
    const populatedProduct = await savedProduct.populate("category");
    return this.normalizeProduct(
      populatedProduct.toObject(),
    ) as ProductDocument;
  }

  async update(
    id: string,
    productData: Partial<ProductDocument>,
  ): Promise<ProductDocument | null> {
    try {
      console.log("Repository updating product with ID:", id);
      console.log("Repository update data:", productData);

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $set: productData },
        { new: true },
      )
        .populate("category")
        .lean()
        .exec();

      if (!updatedProduct) {
        console.log("No product found in DB for ID:", id);
        return null;
      } else {
        console.log("Product updated successfully in DB");
      }

      return this.normalizeProduct(updatedProduct);
    } catch (error) {
      console.error("Error in Repository update:", error);
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
