import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  async findByUserId(userId) {
    const order = await Order.find({ userId });
    return order;
  }
  async findByOrderId(id) {
    const order = await Order.findOne({ _id: id });
    return order;
  }

  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async update({ orderId, update }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
    return updatedOrder;
  }

  async remove(orderId) {
    const order = await Order.deleteOne({ _id: orderId });
    return order;
  }

  async deleteAll() {
    await Order.deleteMany({});
  }

  async insertAll(data) {
    await Order.insertMany(data);
  }
}

const orderModel = new OrderModel();

export { orderModel };
