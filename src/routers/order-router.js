import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { orderService } from '../services';

const orderRouter = Router();

//전체 유저 주문목록조회 API - GET /orderlist/all
orderRouter.get(
  '/orderlist/all',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      const orders = await orderService.getOrders();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
);

// 현재 로그인한 유저를 기준으로 주문목록조회 API -  GET /orderlist/user
orderRouter.get(
  '/orderlist/user',
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.currentUserId;
      const order = await orderService.getOrderByUserId(userId);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
);
// orderID를 기준으로 주문목록조회 API - GET /orders/{orderId}
orderRouter.get(
  '/orders/:orderId',
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderByOrderId(orderId);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
);
// 주문목록에 데이터 추가 -  POST /api/orderitem
orderRouter.post('/orderitem', loginRequired, async (req, res, next) => {
  try {
    //user Id 받아옴 loginRequired 27 line 참조
    const currentUserId = req.currentUserId;
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }
    const { summaryTitle, totalPrice, address, request, status } = req.body;

    const orderInfo = {
      userId: currentUserId,
      summaryTitle,
      totalPrice,
      address,
      request,
      status,
    };
    const newOrder = await orderService.addOrder(orderInfo);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});
// orderId 의 주문 변경 -  PATCH /orders/:orderId
// 바꿀 수 있는 프로퍼티 address,request,status
orderRouter.patch(
  '/orders/:orderId',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }
      // params로부터 id를 가져옴
      const { orderId } = req.params;
      const { address, request, status } = req.body;

      const toUpdate = {
        ...(address && { address }),
        ...(request && { request }),
        ...(status && { status }),
      };

      // 사용자 정보를 업데이트함.
      const updateOrderInfo = await orderService.setOrder(orderId, toUpdate);

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updateOrderInfo);
    } catch (error) {
      next(error);
    }
  },
);
// orderId의 주문 삭제-  DELETE /orders/:orderId
orderRouter.delete(
  '/orders/:orderId',
  loginRequired,
  async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const order = await orderService.deleteOrder(orderId);
      //status 확인 후 중간에 브레이크
      //if(order.status){
      //}
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
);

export { orderRouter };
