import { model } from 'mongoose';
import { CartSchema } from '../schemas/order-schema';

const Cart = model('carts', CartSchema);

export class CartModel {
  async deleteAll() {
    await Category.deleteMany({});
  }
  async insertAll(data) {
    await Category.insertMany(data);
  }
}

const cartModel = new CartModel();

export { cartModel };
