import { productModel } from "../db";

class ProductService{
    constructor(productModel){
        this.productModel=productModel
    }

    //상품 추가
    async addProduct(productInfo){
        const {product_no,product_name,categories,brand} = productInfo
        const newProductInfo = { product_no,product_name,categories,brand};
        console.log("ddddddddddddddddd",newProductInfo)
        const createdNewProduct = await this.productModel.create(newProductInfo);
        return createdNewProduct
    }

    //상품 목록을 받음
    async getProducts() {
        const products = await this.productModel.findAll();
        return products;
    }
}

const productService = new ProductService(productModel)

export{productService}