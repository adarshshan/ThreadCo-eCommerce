import { Address, UserDocument, UserModel } from "../models/UserSchema";
import { connectToDatabase } from "../config/database";

export interface IUserRepository {
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{ users: UserDocument[]; totalItems: number }>;
  findById(id: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  create(user: Omit<UserDocument, "_id">): Promise<UserDocument>;
  update(id: string, user: Partial<UserDocument>): Promise<UserDocument | null>;
  delete(id: string): Promise<boolean>;
  getWishlist(userId: string): Promise<UserDocument | null>;
  addToWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument | null>;
  removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument | null>;
  countAll(): Promise<number>;

  // Address methods
  addAddress(userId: string, address: Address): Promise<UserDocument | null>;
  getAddresses(userId: string): Promise<Address[]>;
  updateAddress(
    userId: string,
    addressId: string,
    address: Partial<Address>,
  ): Promise<UserDocument | null>;
  deleteAddress(
    userId: string,
    addressId: string,
  ): Promise<UserDocument | null>;
  setDefaultAddress(
    userId: string,
    addressId: string,
  ): Promise<UserDocument | null>;
}

export class UserRepository implements IUserRepository {
  constructor() {
    connectToDatabase();
  }

  async getWishlist(userId: string): Promise<UserDocument | null> {
    return (await UserModel.findById(userId)
      .populate("wishlist")
      .exec()) as UserDocument | null;
  }

  async addToWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument | null> {
    return (await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true },
    )
      .populate("wishlist")
      .exec()) as UserDocument | null;
  }

  async removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument | null> {
    return (await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true },
    )
      .populate("wishlist")
      .exec()) as UserDocument | null;
  }

  async countAll(): Promise<number> {
    return await UserModel.countDocuments({});
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<{ users: UserDocument[]; totalItems: number }> {
    const totalItems = await UserModel.countDocuments({});
    const query = UserModel.find();

    if (limit) {
      const pageNum = page || 1;
      const skip = (pageNum - 1) * limit;
      query.skip(skip).limit(limit);
    }

    const users = (await query.exec()) as UserDocument[];
    return { users, totalItems };
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      return (await UserModel.findById(id).exec()) as UserDocument | null;
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

  async findByEmail(email: string): Promise<UserDocument | null> {
    return (await UserModel.findOne({ email }).exec()) as UserDocument | null;
  }

  async create(user: Omit<UserDocument, "_id">): Promise<UserDocument> {
    const newUser = new UserModel(user);
    return (await newUser.save()) as UserDocument;
  }

  async update(
    id: string,
    userData: Partial<UserDocument>,
  ): Promise<UserDocument | null> {
    try {
      return (await UserModel.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true },
      ).exec()) as UserDocument | null;
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

  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Cast to ObjectId failed")
      ) {
        return false;
      }
      throw error;
    }
  }

  // Address Implementation
  async addAddress(
    userId: string,
    address: Address,
  ): Promise<UserDocument | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    // If it's the first address, make it default
    if (user.addresses.length === 0) {
      address.isDefault = true;
    } else if (address.isDefault) {
      // If new address is set as default, unset others
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push(address);
    return await user.save();
  }

  async getAddresses(userId: string): Promise<Address[]> {
    const user = await UserModel.findById(userId).select("addresses").exec();
    return user?.addresses || [];
  }

  async updateAddress(
    userId: string,
    addressId: string,
    addressData: Partial<Address>,
  ): Promise<UserDocument | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    const addressIndex = user.addresses.findIndex(
      (a) => (a as any)._id.toString() === addressId,
    );
    if (addressIndex === -1) return null;

    if (addressData.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    const currentAddress = user.addresses[addressIndex] as any;
    user.addresses[addressIndex] = {
      ...currentAddress?.toObject(),
      ...addressData,
    } as any;

    return await user.save();
  }

  async deleteAddress(
    userId: string,
    addressId: string,
  ): Promise<UserDocument | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    const addressToDelete = user.addresses.find(
      (a) => (a as any)._id.toString() === addressId,
    );
    if (!addressToDelete) return null;

    user.addresses = user.addresses.filter(
      (a) => (a as any)._id.toString() !== addressId,
    ) as any;

    // If we deleted the default address and there are other addresses, make the first one default
    if (addressToDelete.isDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    return await user.save();
  }

  async setDefaultAddress(
    userId: string,
    addressId: string,
  ): Promise<UserDocument | null> {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    user.addresses.forEach((a) => {
      a.isDefault = (a as any)._id.toString() === addressId;
    });

    return await user.save();
  }
}
