import { model } from 'mongoose';
import { CartSchema } from '../schemas/cart-schema';

const Cart = model('carts', CartSchema);

export class CartModel {
  async create(cartInfo) {
    const createdNewCart = await Cart.create(cartInfo);
    return createdNewCart;
  }

  async findAll() {
    const carts = await Cart.find({});
    return carts;
  }
  async findOneById(cartId) {
    const cart = await Cart.findOne({ _id: cartId });
    return cart;
  }
  async findOneByName(title) {
    const cart = await Cart.findOne({ title });
    return cart;
  }
  async findOneAndDelete(query) {
    const deletedCart = await Cart.findOneAndDelete(query);
    return deletedCart;
  }
  async update({ cartId, update }) {
    const filter = { cartId };
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
