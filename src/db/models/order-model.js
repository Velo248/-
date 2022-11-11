import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  async find(query, projection, sort = { id: 1 }, options = { lean: true }) {
    return await Order.find(query, projection, options).sort(sort).exec();
  }

  async findByUserId(userId) {
    const orders = await Order.find({ userId });
    return orders;
  }

  async findOneByOrderId(orderId) {
    const order = await Order.findOne({ _id: orderId });
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

  async deleteOne(filter) {
    const result = await Order.deleteOne(filter);
    return result;
  }

  //mock-generator
  async deleteAll() {
    await Order.deleteMany({});
  }

  async getCount() {
    return await Order.countDocuments({});
  }
}

const orderModel = new OrderModel();

export { orderModel };
