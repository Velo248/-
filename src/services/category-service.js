import { categoryModel } from '../db';

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  //카테고리 추가
  async addCategory(categoryInfo) {
    const createdNewCategory = await this.categoryModel.create(categoryInfo);
    return createdNewCategory;
  }

  //카테고리 목록을 받음
  async getCategorylist() {
    const products = await this.categoryModel.findAll();
    return products;
  }

  //카테고리 이름으로 카테고리 받음
  async getCategory(categories) {
    const category = await this.categoryModel.findOneByName(categories);
    return category;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
