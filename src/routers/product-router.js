import { Router } from 'express';
import { isAdmin, loginRequired } from '../middlewares';
import { productController } from '../controllers';

const productRouter = Router();

//전체 상품조회 API - GET /api/products
productRouter.get('/products', productController.getProducts);

//특정 상품 조회 API - GET /api/product/{productId}
productRouter.get('/products/:productId', productController.getByProductId);

//상품 추가 API - /api/product
productRouter.post(
  '/admin/products',
  loginRequired,
  isAdmin,
  productController.addProducts,
);

//상품 수정 API - PATCH/api/product/{productId}
productRouter.patch(
  '/admin/products/:productId',
  loginRequired,
  isAdmin,
  productController.updateByProductId,
);

//상품 삭제 API - DELETE /api/product/{productId}
productRouter.delete(
  '/admin/products/:productId',
  loginRequired,
  isAdmin,
  productController.deleteByProductId,
);

export { productRouter };
