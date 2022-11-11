import { model } from 'mongoose';
import { BasketSchema } from '../schemas/basket-schema';

const Basket = model('basket', BasketSchema);

export class BasketModel {
  async create(body) {
    const createdNewBasket = await Basket.create(body);
    return createdNewBasket;
  }
  async update(filter, body, options = { lean: true, new: true }) {
    return await Basket.findOneAndUpdate(filter, body, options).exec();
  }

  async findOne(query, projection, options = { lean: true }) {
    return await Basket.findOne(query, projection, options).exec();
  }
  async find(query, projection, sort = { id: 1 }, options = { lean: true }) {
    return await Basket.find(query, projection, options).sort(sort).exec();
  }
  async deleteOne(filter) {
    return await Basket.findOneAndDelete(filter).exec();
  }
  async deleteAll(filter = {}) {
    await Basket.deleteMany(filter);
  }
}

const basketModel = new BasketModel();

export { basketModel };
