import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  async find(query, projection, sort = { id: 1 }, options = { lean: true }) {
    return await Category.find(query, projection, options).sort(sort).exec();
  }
  async findOne(query, projection, options = { lean: true }) {
    return await Category.findOne(query, projection, options).exec();
  }
  async findAll() {
    const categories = await Category.find({});
    return categories;
  }
  async findOneById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    return category;
  }
  async findOneAndDelete(categoryId) {
    const deletedCategory = await Category.findOneAndDelete({
      _id: categoryId,
    });
    return deletedCategory;
  }
  async update({ categoryId, update }) {
    const filter = { _id: categoryId };
    const option = { returnOriginal: false };

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedCategory;
  }
  async deleteAll() {
    await Category.deleteMany({});
  }
  async findFilteredBySortAndOrders(query) {
    const { sortBy, orderBy, limit, offset } = query;
    const orders = await Order.find({})
      .sort({ [sortBy]: orderBy })
      .skip(limit * (offset - 1))
      .limit(limit);
    return orders;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
