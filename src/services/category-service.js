import { categoryModel } from '../db';

class CategoryService {
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  //카테고리 추가
  async addCategory(categoryInfo) {
    //같은이름의 카테고리가 이미 있다면 추가하지 않음
    const category = await this.categoryModel.findOneByName(categoryInfo.title);
    if (category) {
      throw new Error(
        '이 이름은 현재 사용중입니다. 다른 이름을 입력해 주세요..',
      );
    }
    const createdNewCategory = await this.categoryModel.create(categoryInfo);
    return createdNewCategory;
  }

  //카테고리 목록을 받음
  async getCategorylist() {
    const products = await this.categoryModel.findAll();
    return products;
  }

  //카테고리 아이디로 카테고리 받음
  async getCategory(categoryId) {
    const category = await this.categoryModel.findOneById(categoryId);
    return category;
  }
  //카테고리 아이디로 카테고리 받음
  async getCategoryByName(title) {
    const category = await this.categoryModel.findOneByName(title);
    return category;
  }
  //카테고리 정보 수정
  async updateCategory(categoryId, toUpdate) {
    // 우선 해당 title의 카테고리가 db에 있는지 확인
    let category = await this.categoryModel.findOneById(categoryId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error('해당 카테고리가 없습니다. 다시 확인해 주세요.');
    }

    // 업데이트 진행
    category = await this.categoryModel.update({
      categoryId,
      update: toUpdate,
    });

    return category;
  }
  //카테고리 이름으로 삭제
  async deleteCategory(title) {
    const deletedCategory = await this.categoryModel.findOneAndDelete({
      title,
    });
    return deletedCategory;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
