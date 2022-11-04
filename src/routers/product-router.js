import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { productService } from '../services';

const productRouter = Router();

//전체 상품조회 API - GET /api/productlist
productRouter.get('/products', async (req, res, next) => {
  try {
    //전체 상품 목록을 얻음
    const products = await productService.getProductlist();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//특정 카테고리의 상품들 조회 API - GET /api/productlist/category/category_id
productRouter.get('/products/category/:categoryId', async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await productService.getProductlistByCategory(categoryId);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//특정 상품 조회 API - GET /api/product/{productId}
productRouter.get('/products/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductByProductId(productId);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

//상품 추가 API - /api/product
productRouter.post(
  '/products',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }

      // req (request)의 body 에서 데이터 가져오기
      const {
        title,
        sellerId,
        categoryId,
        manufacturer,
        shortDescription,
        detailDescription,
        imageKey,
        inventory,
        price,
        searchKeywords,
        isRecommended,
        discountPercent,
      } = req.body;
      //상품 추가, 만약 같은 이름의 상품이 이미 있는 경우 추가하지 않음
      console.log(title);
      const product = await productService.getProduct(title);
      // console.log(product);
      if (product) {
        throw new Error(
          '이 이름은 현재 사용중입니다. 다른 이름을 입력해 주세요..',
        );
      }
      const newProduct = await productService.addProduct({
        title,
        sellerId,
        categoryId,
        manufacturer,
        shortDescription,
        detailDescription,
        imageKey,
        inventory,
        price,
        searchKeywords,
        isRecommended,
        discountPercent,
      });

      // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
      // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  },
);

//상품 수정 API - PATCH/api/product/{productId}
productRouter.patch(
  '/products/:productId',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
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
        title,
        sellerId,
        categoryId,
        manufacturer,
        shortDescription,
        detailDescription,
        imageKey,
        inventory,
        price,
        searchKeywords,
        isRecommended,
        discountPercent,
      } = req.body;

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(title && { title }),
        ...(sellerId && { sellerId }),
        ...(categoryId && { categoryId }),
        ...(manufacturer && { manufacturer }),
        ...(shortDescription && { shortDescription }),
        ...(detailDescription && { detailDescription }),
        ...(imageKey && { imageKey }),
        ...(inventory && { inventory }),
        ...(price && { price }),
        ...(searchKeywords && { searchKeywords }),
        ...(isRecommended && { isRecommended }),
        ...(discountPercent && { discountPercent }),
      };
      const updatedProuct = await productService.updateProduct(
        productId,
        toUpdate,
      );
      res.status(200).json(updatedProuct);
    } catch (error) {
      next(error);
    }
  },
);

//상품 삭제 API - DELETE /api/product/{productId}
productRouter.delete(
  '/products/:productId',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const deletedProduct = await productService.deleteProduct(productId);
      res.status(200).json(deletedProduct);
    } catch (error) {
      next(error);
    }
  },
);

//상품 페이지네이션
productRouter.get('/page/products', async (req, res, next) => {
  try {
    const sort = req.query.sort || 'created_date';
    const sortOrder = req.query.sortOrder || 'asc'; // url 쿼리에서 order 받기, 기본값 asc
    const offset = Number(req.query.offset || 1); // url 쿼리에서 offset 받기, 기본값 1
    const limit = Number(req.query.limit || 10); // url 쿼리에서 limit 받기, 기본값 10
    //sortKey은 임의로 정한 것 변경 필요
    const sortKey = {
      created_date: 'createdAt',
      updated_date: 'updatedAt',
    };
    const sortOrderType = { asc: 1, desc: -1 };
    if (!Object.keys(sortKey).includes(sort)) {
      throw new Error(
        `잘못된 sort값 입니다. ['created_date', 'updated_date'] 중에서 선택해주세요`,
      );
    }
    if (!Object.keys(sortOrderType).includes(sortOrder)) {
      throw new Error(
        `잘못된 order값 입니다.['asc', 'desc'] 중에서 선택해주세요`,
      );
    }
    if (offset < 1 || 5000 <= offset) {
      throw new Error('offset 범위는 1-5000입니다.');
    }
    if (limit < 1 || 100 <= limit) {
      throw new Error('limit 범위는 1-100입니다.');
    }
    const newQuery = {
      sortKey: sortKey[sort],
      sortOrder: sortOrderType[sortOrder],
      offset,
      limit,
    };
    const { products, ...query } = await productService.getProductsByAdmin(
      newQuery,
    );
    res.status(200).json({ ...query, products });
  } catch (error) {
    next(error);
  }
});

export { productRouter };
