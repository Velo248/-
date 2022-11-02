import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { categoryService, productService } from '../services';

const productRouter = Router();

//전체 상품조회
productRouter.get('/products', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    // if (is.emptyObject(req.body)) {
    //     throw new Error(
    //     "headers의 Content-Type을 application/json으로 설정해주세요"
    //     );
    // }
    //전체 상품 목록을 얻음
    const products = await productService.getProducts();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//상품 추가 API - /api/products
productRouter.post('/products', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { product_no, product_name, brand, categories } = req.body;
    //상품 추가 / 같은 이름의 상품이 이미 있는 경우 추가하지 않음
    const product = await productService.getProduct(product_name);
    if (product) {
      res.status(201).json(product);
      return;
    }
    const newProduct = await productService.addProduct({
      product_no,
      product_name,
      brand,
      categories,
    });

    //카테고리 데이터베이스에서 해당 카테고리 이름이 있는지 찾고 없으면 새로 카테고리 만들기
    let temp = [];
    for (let c of categories) {
      const category = await categoryService.getCategory(c);
      if (!category) {
        temp.push(c);
      }
    }
    for (let c of temp) {
      await categoryService.addCategory({ category_name: c });
    }

    //카테고리에 상품추가
    for (let category_name of categories) {
      await categoryService.addProduct(category_name, newProduct);
    }

    // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

//상품 수정 API - /api/products/:productId
productRouter.patch('/products/:productId', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }
    const productId = req.params.productId;
    const {
      product_no,
      product_name,
      price,
      brand,
      specification,
      categories,
    } = req.body;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(product_no && { product_no }),
      ...(product_name && { product_name }),
      ...(price && { price }),
      ...(brand && { brand }),
      ...(specification && { specification }),
      ...(categories && { categories }),
    };
    const updatedProuct = await productService.updateProduct(
      productId,
      toUpdate,
    );
    res.status(200).json(updatedProuct);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
