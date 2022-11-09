import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { basketService } from '../services';
import { loginRequired } from '../middlewares';
import { asyncHandler } from '../utils/async-handler';

const basketRouter = Router();
basketRouter.get(
  '/baskets',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const baskets = await basketService.getBasketsByUserId(currentUserId);
    res.status(200).json({ baskets });
  }),
);

basketRouter.post(
  '/baskets',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const { orderSheets } = req.body;
    const baskets = await basketService.addBasket(currentUserId, orderSheets);
    res.status(200).json({ baskets });
  }),
);
basketRouter.patch(
  '/baskets',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const { orderSheets } = req.body;
    const baskets = await basketService.updateBasket(
      currentUserId,
      orderSheets,
    );

    res.status(200).json({ baskets });
  }),
);

basketRouter.delete(
  '/baskets',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const baskets = await basketService.deleteBaskets(currentUserId);

    res.status(200).json({ baskets });
  }),
);
basketRouter.delete(
  '/baskets/:basketId',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const { basketId } = req.params;
    const basket = await basketService.deleteBasket(currentUserId, basketId);

    res.status(200).json({ basket });
  }),
);
export { basketRouter };
