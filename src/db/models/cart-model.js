import { model } from 'mongoose';
import { CartSchema } from '../schemas/cart-schema';

const Cart = model('carts', CartSchema);

export class CartModel {
  async create(cartInfo) {
    const createdNewCart = await Cart.create(cartInfo);
    return createdNewCart;
  }

  async findOneByUserId(userId) {
    const cart = await Cart.findOne({ userId: userId });
    return cart;
  }

  async findOneAndDelete(query) {
    const deletedCart = await Cart.findOneAndDelete(query);
    return deletedCart;
  }
  async updateByUserID({ userId, update }) {
    const filter = { userId };
    const option = { returnOriginal: false };
    const updatedCart = await Cart.findOneAndUpdate(filter, update, option);
    return updatedCart;
  }

  async deleteAll() {
    await Cart.deleteMany({});
  }
  async insertAll(data) {
    await Cart.insertMany(data);
  }

  async deleteById(cartId) {
    const cart = await Cart.deleteOne({ _id: cartId });
    return cart;
  }
}

const cartModel = new CartModel();

export { cartModel };
