import { productModel } from '../db';

class SearchService {
  constructor(productModel) {
    this.productModel = productModel;
  }

  async searchProducts(search) {
    //search:String = "노랑 텀블러"
    const keywords = search.split(' ');
    const products = await this.productModel.findByKeywords(keywords);
    return products;
  }
}

const searchService = new SearchService(productModel);

export { searchService };
