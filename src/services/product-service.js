import { productModel } from '../db';

class ProductService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  //상품 추가
  async addProduct(productInfo) {
    const { title } = productInfo;
    //상품 추가, 만약 같은 이름의 상품이 이미 있는 경우 추가하지 않음

    const product = await this.productModel.findByName(title);

    if (product) {
      throw new Error(
        '이 이름은 현재 사용중입니다. 다른 이름을 입력해 주세요..',
      );
    }
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
  //상품 아이디로 가져옴
  async getProductByProductId(productId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let foundProduct = await this.productModel.findById(productId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!foundProduct) {
      throw new Error(
        '해당 productId의 상품이 없습니다. 다시 한 번 확인해 주세요.',
      );
    }
    const product = await this.productModel.findById(productId);
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
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findById(productId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new Error(
        '해당 productId의 상품이 없습니다. 다시 한 번 확인해 주세요.',
      );
    }
    const deletedProduct = this.productModel.delete(productId);
    return deletedProduct;
  }

  async getProductsByQuery(query) {
    const products = await this.productModel.findByQuery(query);
    const { limit, offset } = query;
    let totalProductPage = Math.ceil(products.count / limit);
    // 총페이지필요하면 그때
    if (!limit) {
      totalProductPage = 1;
    }
    if (offset > totalProductPage) {
      throw new Error(`offset 범위는 1-${totalProductPage}입니다.`);
    }
    return { ...products, totalProductPage };
  }

  async getProductsCount() {
    return this.productModel.getProductsCount();
  }

  async searchProducts(search) {
    //search:String = "노랑 텀블러"

    const keywords = search.split(' ');

    const products = await this.productModel.findByKeywords(keywords);
    return products;
  }
}

const productService = new ProductService(productModel);

export { productService };
