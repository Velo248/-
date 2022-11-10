import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { searchService } from '../services';
import { asyncHandler } from '../utils/async-handler';

const searchRouter = Router();

//서치키워드들로 상품들 조회 API - GET /api/search/products?keyword=노랑 노트북
searchRouter.get(
  '/search',
  asyncHandler(async (req, res) => {
    const { keyword } = req.query;

    if (keyword) {
      const products = await searchService.searchProducts(keyword);
      res.status(200).json(products);
    } else {
      res.status(421).json({
        err: 'Misdirected Request',
        reason: 'querystring should include search',
      });
    }
  }),
);

export { searchRouter };
