import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  //query가 있을 때 작업
  async findFilteredBySortAndOrders(query) {
    const { sortBy, orderBy, limit, offset } = query;
    const orders = await Order.find({})
      .sort({ [sortBy]: orderBy })
      .skip(limit * (offset - 1))
      .limit(limit);
    return orders;
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

  async deleteOneByOrderId(orderId) {
    const result = await Order.deleteOne({ _id: orderId });
    return result;
  }

  async deleteAll() {
    await Order.deleteMany({});
  }

  async insertAll(data) {
    await Order.insertMany(data);
  }

  async getOrdersCount() {
    return await Order.countDocuments({});
  }
}

const orderModel = new OrderModel();

export { orderModel };
