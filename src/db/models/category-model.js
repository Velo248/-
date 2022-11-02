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
  async findOneByName(categories) {
    const category = await Category.findOne({ category_name: categories });
    return category;
  }
  async findOneAndUpdate(category_name, product) {
    await Category.findOneAndUpdate(
      { category_name },
      { $push: { products: product } },
    );
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
