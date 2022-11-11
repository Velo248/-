import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { searchController } from '../controllers';
const searchRouter = Router();

//서치키워드들로 상품들 조회 API - GET /api/search/products?keyword=노랑 노트북
searchRouter.get('/search', searchController.getProducts);

export { searchRouter };
