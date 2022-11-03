import { productModel } from '../db';

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  //상품 추가
  async addProduct(productInfo) {
    const createdNewProduct = await this.productModel.create(productInfo);
    return createdNewProduct;
  }

  //상품 전체 목록을 받음
  async getProductlist() {
    const products = await this.productModel.findAll();
    return products;
  }

  //상품 이름으로 가져옴
  async getProduct(product_name) {
    const product = await this.productModel.findByName(product_name);
    return product;
  }

  //상품정보 수정
  async updateProduct(productId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new Error(
        '해당 productId의 상품이 없습니다. 다시 한 번 확인해 주세요.',
      );
    }

    // 업데이트 진행
    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    return product;
  }

  //상품 삭제
  async deleteProduct(productId) {
    const deletedProduct = this.productModel.delete(productId);
    return deletedProduct;
  }
}

const productService = new ProductService(productModel);

export { productService };
