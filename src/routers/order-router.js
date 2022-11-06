import { query, Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { isAdmin, loginRequired } from '../middlewares';
import { orderService } from '../services';

const orderRouter = Router();

//전체 유저 주문목록조회 API -
orderRouter.get(
  '/admin/orders',
  loginRequired,
  isAdmin,
  async (req, res, next) => {
    try {
      const sort = req.query.sort || 'created_date';
      const sortOrder = req.query.sortOrder || 'asc'; // url 쿼리에서 order 받기, 기본값 asc
      const offset = Number(req.query.offset || 1); // url 쿼리에서 offset 받기, 기본값 1
      const limit = Number(req.query.limit || 10); // url 쿼리에서 limit 받기, 기본값 10
      //sortKey은 임의로 정한 것 변경 필요
      const sortKey = {
        created_date: 'createdAt',
        updated_date: 'updatedAt',
      };
      const sortOrderType = { asc: 1, desc: -1 };
      if (!Object.keys(sortKey).includes(sort)) {
        throw new Error(
          `잘못된 sort값 입니다. ['created_date', 'updated_date'] 중에서 선택해주세요`,
        );
      }
      if (!Object.keys(sortOrderType).includes(sortOrder)) {
        throw new Error(
          `잘못된 order값 입니다.['asc', 'desc'] 중에서 선택해주세요`,
        );
      }
      if (offset < 1 || 5000 <= offset) {
        throw new Error('offset 범위는 1-5000입니다.');
      }
      if (limit < 1 || 100 <= limit) {
        throw new Error('limit 범위는 1-100입니다.');
      }
      const newQuery = {
        sortKey: sortKey[sort],
        sortOrder: sortOrderType[sortOrder],
        offset,
        limit,
      };
      const { orders, ...query } = await orderService.getOrdersByAdmin(
        newQuery,
      );
      res.status(200).json({ ...query, orders });
    } catch (error) {
      next(error);
    }
  },
);

// 현재 로그인한 유저를 기준으로 주문목록조회
orderRouter.get('/orders', loginRequired, async function (req, res, next) {
  try {
    const { currentUserId } = req;
    const order = await orderService.getOrderByUserId(currentUserId);
    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
});
// orderID를 기준으로 주문목록조회 API -
orderRouter.get(
  '/orders/:orderId',
  loginRequired,
  async function (req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderByOrderId(orderId);
      res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  },
);
// 주문목록에 데이터 추가 -
orderRouter.post('/orders', loginRequired, async (req, res, next) => {
  try {
    //user Id 받아옴 loginRequired 27 line 참조
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }
    const currentUserId = req.currentUserId;
    const { address, request, items } = req.body;

    const orderInfo = {
      userId: currentUserId,
      address,
      request,
      items,
    };
    const newOrder = await orderService.addOrder(orderInfo);
    res.status(201).json({ newOrder });
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
      res.status(200).json({ updateOrderInfo });
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
      const deletedResult = await orderService.deleteOrder(orderId);
      res.status(200).json(deletedResult);
    } catch (error) {
      next(error);
    }
  },
);

export { orderRouter };
