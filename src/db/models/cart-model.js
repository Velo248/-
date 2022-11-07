import { model } from 'mongoose';
import { CartSchema } from '../schemas/cart-schema';

const Cart = model('carts', CartSchema);

export class CartModel {
  async create(cartInfo) {
    const createdNewCart = await Cart.create(cartInfo);
    return createdNewCart;
  }

  async findOneByUserId(userId) {
    const cart = await Cart.findOne({ userId });
    return cart;
  }
  async addOrderSheet(userId, orderSheet) {
    const cart = await Cart.findOne({ userId });
    //같은상품인경우 push로 추가하지않고 quantity를 합쳐줌
    let index = -1;
    for (const order in cart.orderSheets) {
      if (orderSheet.productId == cart.orderSheets[order].productId) {
        index = order;
      }
    }

    if (index < 0) {
      await Cart.updateOne({ userId }, { $push: { orderSheets: orderSheet } });
    } else {
      const sum = cart.orderSheets[index].quantity + orderSheet.quantity;
      //기존 orderSheets를 넘겨줘야 덮어쓰지않고 수정이됨

      cart.orderSheets.splice(index, 1);
      await Cart.updateOne(
        { userId },
        {
          orderSheets: [
            ...cart.orderSheets,
            { productId: orderSheet.productId, quantity: sum },
          ],
        },
      );
    }

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
