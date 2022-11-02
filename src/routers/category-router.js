import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { categoryService } from '../services';

const categoryRouter = Router();

//전체 카테고리조회
categoryRouter.get('/categories', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    // if (is.emptyObject(req.body)) {
    //     throw new Error(
    //     "headers의 Content-Type을 application/json으로 설정해주세요"
    //     );
    // }
    const categories = await categoryService.getCategories();

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
});

//카테고리 추가 / 프론트에서 특정 카테고리 하위의 상품들 조회용으로 사용될 수 있음
categoryRouter.post('/categories', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const { category_name } = req.body;

    //같은이름의 카테고리가 이미 있다면 추가하지 않음
    const category = await categoryService.getCategory(category_name);
    if (category) {
      res.status(201).json(category);
      return;
    }

    const newCategory = await categoryService.addCategory({ category_name });
    // 추가된 카테고리 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

export { categoryRouter };
