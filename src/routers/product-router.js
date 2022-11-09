import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { productService } from '../services';

const productRouter = Router();

//전체 상품조회 API - GET /api/products
productRouter.get('/products', async (req, res, next) => {
  try {
    // if (Object.keys(req.query).length === 0) {
    //   //전체 상품 목록을 얻음
    //   const products = await productService.getProductlist();
    //   res.status(200).json(products);
    // } else {
    const sortBy = req.query.sortBy || 'created_date';
    const sortOrder = req.query.orderBy || 'asc'; // url 쿼리에서 order 받기, 기본값 asc
    const offset = Number(req.query.offset || 1); // url 쿼리에서 offset 받기, 기본값 1
    const limit = Number(req.query.limit || 0); // url 쿼리에서 limit 받기, 기본값 0
    const priceMax = Number(req.query.priceMax); // url 쿼리에서 priceMax 받기
    const priceMin = Number(req.query.priceMin || 0); // url 쿼리에서 priceMin 받기 기본값 0
    //sortKey은 임의로 정한 것 변경 필요
    const sortKey = {
      created_date: 'createdAt',
      updated_date: 'updatedAt',
    };
    const sortOrderType = { asc: 1, desc: -1 };
    if (!Object.keys(sortKey).includes(sortBy)) {
      throw new Error(
        `잘못된 sort값 입니다. ['created_date', 'updated_date'] 중에서 선택해주세요`,
      );
    }
    if (!Object.keys(sortOrderType).includes(sortOrder)) {
      throw new Error(
        `잘못된 order값 입니다.['asc', 'desc'] 중에서 선택해주세요`,
      );
    }
    if (offset < 1) {
      throw new Error(`offset 0보다 커야합니다.`);
    }
    if (limit < 0) {
      throw new Error(`limit 0보다 크거나 같아야합니다.`);
    }
    const newQuery = {
      sortBy: sortKey[sortBy],
      orderBy: sortOrderType[sortOrder],
      offset,
      limit,
      priceMax,
      priceMin,
    };

    const products = await productService.getProductsByQuery(newQuery);

    res.status(200).json(products);
    // }
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
  '/admin/products',
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
  '/admin/products/:productId',
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
      const updatedProduct = await productService.updateProduct(
        productId,
        toUpdate,
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
);

//상품 삭제 API - DELETE /api/product/{productId}
productRouter.delete(
  '/admin/products/:productId',
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

export { productRouter };
