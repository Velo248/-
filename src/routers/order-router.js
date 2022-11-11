import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { orderController } from '../controllers';
import { asyncHandler } from '../utils/async-handler';

const orderRouter = Router();

//전체 유저 주문목록조회 API -
orderRouter.get(
  '/admin/orders',
  loginRequired,
  isAdmin,
  orderController.getOrders,
);

// 현재 로그인한 유저를 기준으로 주문목록조회
orderRouter.get('/orders', loginRequired, orderController.getOrders);
// orderID를 기준으로 주문목록조회 API -
orderRouter.get('/orders/:orderId', loginRequired, orderController.getOrder);
// 주문목록에 데이터 추가 -
orderRouter.post('/orders', loginRequired, orderController.addOrder);

orderRouter.patch('/orders/:orderId', loginRequired, orderController.setOrder);
// orderId 의 주문 변경 -  PATCH /orders/:orderId
// 바꿀 수 있는 프로퍼티 address,request,status
orderRouter.patch(
  '/admin/orders/:orderId',
  loginRequired,
  isAdmin,
  orderController.setOrderAdmin,
);
// orderId의 주문 삭제-  DELETE /orders/:orderId
orderRouter.delete('/orders/:orderId', loginRequired, orderController.delete);
orderRouter.delete(
  '/admin/orders/:orderId',
  loginRequired,
  isAdmin,
  orderController.deleteAdmin,
);
export { orderRouter };
