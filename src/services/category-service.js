import { categoryModel } from "../db";

class CategoryService{
    constructor(categoryModel){
        this.categoryModel=categoryModel
    }

    //카테고리 추가
    async addCategory(categoryInfo){
        const {category_name} = categoryInfo
        const newCategoryInfo = { category_name};
        const createdNewCategory = await this.categoryModel.create(newCategoryInfo);
        return createdNewCategory
    }

    //카테고리 목록을 받음
    async getCategories() {
        const products = await this.categoryModel.findAll();
        return products;
    }

    //카테고리 이름으로 카테고리 받음
    async getCategory(categories){
        const category = await this.categoryModel.findOneByName(categories)
        return category
    }

    //카테고리에 상품추가
    async addProduct(category_name,product){
        await this.categoryModel.findOneAndUpdate(category_name,product)
    }
}

const categoryService = new CategoryService(categoryModel)

export{categoryService}