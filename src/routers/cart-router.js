import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { cartService } from '../services';

const cartRouter = Router();

//전체 카테고리 조회 API - GET /api/carts
cartRouter.get('/carts', async (req, res, next) => {
  try {
    const carts = await cartService.getCarts();
    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
});
//특정 카테고리 조회 API - GET /api/carts/{cartId}
cartRouter.get('/carts/:cartId', async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const cart = await cartService.getCart(cartId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

//카테고리 추가 API - POST /cart
cartRouter.post('/carts', loginRequired, async (req, res, next) => {
  try {
    const { currentUserId } = req;
    const { orderSheet } = req.body;
    const { productId, quantity } = orderSheet;
    if (!productId) {
      throw new Error('productId 가 비어있어요');
    }
    if (!quantity) {
      throw new Error('quantity 가 비어있어요');
    }
    const newCart = await cartService.addCart({
      orderSheet: {
        productId,
        quantity,
      },
      userId: currentUserId,
    });
    // 추가된 카테고리 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
});

//카테고리 수정 API - PATCH /cart/{cartId}
cartRouter.patch(
  '/carts/:cartId',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      const { orderSheet } = req.body;
      const { productId, quantity } = orderSheet;
      if (!productId) {
        throw new Error('productId 가 비어있어요');
      }
      if (!quantity) {
        throw new Error('quantity 가 비어있어요');
      }
      //서비스로직에서 처리 해야할듯 ?

      const toUpdate = {
        ...(orderSheet && { orderSheet }),
      };
      const updatedCart = await cartService.updateCart(cartId, toUpdate);
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  },
);

//카테고리 삭제 API - DELETE /cart/{cartId}
cartRouter.delete('/carts/:cartId', loginRequired, async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const deletedCart = await cartService.deleteCart(cartId);
    res.status(200).json(deletedCart);
  } catch (error) {
    next(error);
  }
});
export { cartRouter };
