import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema";

const Category = model("categories", CategorySchema);

export class CategoryModel {
    async create(categoryInfo) {
        const createdNewCategory = await Category.create(categoryInfo);
        return createdNewCategory;
      }
    
      async findAll() {
        const categories = await Category.find({});
        return categories;
      }
    async findByName(categories){
        const category = await Category.find({category_name:categories})
        return category
    }
}

const categoryModel = new CategoryModel();

export { categoryModel };
