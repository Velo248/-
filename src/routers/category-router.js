import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { categoryService } from '../services';

const categoryRouter = Router();

//전체 카테고리 조회 API - GET /api/categories
categoryRouter.get('/categories', async (req, res, next) => {
  try {
    const categories = await categoryService.getCategorylist();

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});
//특정 카테고리 조회 API - GET /api/categories/{categoryId}
categoryRouter.get('/categories/:categoryId', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await categoryService.getCategory(categoryId);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});
categoryRouter.get(
  '/categories/:categoryId/products',
  async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const products = await categoryService.getProductsByCategories(
        categoryId,
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
);
categoryRouter.get(
  '/admin/deleted-categories/products',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      const products = await categoryService.getDeletedCategoriesProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
);

//카테고리 추가 API - POST /category
categoryRouter.post(
  '/admin/categories',
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
      const { title, description, themeClass, imageKey } = req.body;

      const newCategory = await categoryService.addCategory({
        title,
        description,
        themeClass,
        imageKey,
      });
      // 추가된 카테고리 db 데이터를 프론트에 다시 보내줌
      // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  },
);

//카테고리 수정 API - PATCH /category/{categoryId}
categoryRouter.patch(
  '/admin/categories/:categoryId',
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
      const categoryId = req.params.categoryId;
      const { title, description, themeClass, imageKey } = req.body;

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(title && { title }),
        ...(description && { description }),
        ...(themeClass && { themeClass }),
        ...(imageKey && { imageKey }),
      };
      const updatedCategory = await categoryService.updateCategory(
        categoryId,
        toUpdate,
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  },
);

//카테고리 삭제 API - DELETE /category/{categoryId}
categoryRouter.delete(
  '/admin/categories/:categoryId',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId;
      const deletedCategory = await categoryService.deleteCategory(categoryId);
      res.status(200).json(deletedCategory);
    } catch (error) {
      next(error);
    }
  },
);
export { categoryRouter };
