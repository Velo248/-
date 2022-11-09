import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { cartService } from '../services';
import { asyncHandler } from '../utils/async-handler';

const cartRouter = Router();

//전체 장바구니 조회 API - GET /api/carts
cartRouter.get(
  '/carts',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    console.log(currentUserId);
    const carts = await cartService.getCartByUserId(currentUserId);
    res.status(200).json(carts);
  }),
);
//장바구니 추가 API - POST /cart
cartRouter.post(
  '/carts',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const { orderSheets } = req.body;
    const newCart = await cartService.addOrderSheets({
      orderSheets,
      userId: currentUserId,
    });
    // 추가된 장바구니 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json({ newCart });
  }),
);

//장바구니에 추가 API - PATCH /cart/{cartId}
cartRouter.patch(
  '/carts',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const { productId, quantity } = req.body;
    if (!productId) {
      throw new Error('productId 가 비어있어요');
    }
    if (!quantity) {
      throw new Error('quantity 가 비어있어요');
    }

    const orderSheets = {
      productId,
      quantity,
    };
    const toUpdate = {
      ...(orderSheets && { orderSheets }),
    };
    const updatedCart = await cartService.updateCartByUserId(
      currentUserId,
      toUpdate,
    );
    res.status(200).json(updatedCart);
  }),
);

//장바구니 삭제 API - DELETE /cart/{cartId}
cartRouter.delete(
  '/carts',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const { currentUserId } = req;
    if (productId) {
      const deletedCart = await cartService.deleteCart(
        currentUserId,
        productId,
      );
      res.status(200).json(deletedCart);
      return;
    }
    const deletedCart = await cartService.deleteCartAll(currentUserId);
    res.status(200).json(deletedCart);
    return;
  }),
);

//아래는 잘되는지 테스팅용 코드 위에는 일일이 register,login 과정을 거쳐야하기때문
cartRouter.get(
  '/carts/:userId',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const carts = await cartService.getCartByUserId(userId);
    res.status(200).json(carts);
  }),
);
cartRouter.post(
  '/carts/:userId',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { orderSheets } = req.body;
    const newCart = await cartService.addOrderSheets({
      userId,
      orderSheets,
    });
    // 추가된 장바구니 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json({ newCart });
  }),
);

export { cartRouter };
