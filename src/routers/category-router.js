import { Router } from 'express';
import { isAdmin, loginRequired } from '../middlewares';
import { categoryController } from '../controllers/category-controller';
const categoryRouter = Router();

//전체 카테고리 조회 API - GET /api/categories
categoryRouter.get('/categories', categoryController.getCategory);
//특정 카테고리 조회 API - GET /api/categories/{categoryId}
categoryRouter.get(
  '/categories/:categoryId',
  categoryController.getByCategoryId,
);
categoryRouter.get(
  '/categories/:categoryId/products',
  categoryController.getProducts,
);
categoryRouter.get(
  '/admin/deleted-categories/products',
  loginRequired,
  isAdmin,
  categoryController.getDeletedProducts,
);

//카테고리 추가 API - POST /category
categoryRouter.post(
  '/admin/categories',
  loginRequired,
  isAdmin,
  categoryController.addCategory,
);

//카테고리 수정 API - PATCH /category/{categoryId}
categoryRouter.patch(
  '/admin/categories/:categoryId',
  loginRequired,
  isAdmin,
  categoryController.updateCategory,
);

//카테고리 삭제 API - DELETE /category/{categoryId}
categoryRouter.delete(
  '/admin/categories/:categoryId',
  loginRequired,
  isAdmin,
  categoryController.deleteCategoryById,
);
export { categoryRouter };
