import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('categories', CategorySchema);

export class CategoryModel {
  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }

  async findAll() {
    const categories = await Category.find({});
    return categories;
  }
  async findOneById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    return category;
  }
  async findOneByName(title) {
    const category = await Category.findOne({ title });
    return category;
  }
  async findOneAndDelete(query) {
    const deletedCategory = await Category.findOneAndDelete(query);
    return deletedCategory;
  }
  async update({ categoryId, update }) {
    const filter = { categoryId };
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
  async insertAll(data) {
    await Category.insertMany(data);
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
