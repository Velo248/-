import { orderService } from '../services';

class OrderController {
  async getOrders(req, res, next) {
    try {
      const sortBy = req.query.sort || 'created_date';
      const orderBy = req.query.order || 'asc'; // url 쿼리에서 order 받기, 기본값 asc
      const offset = Number(req.query.offset) ? req.query.offset : 1; // url 쿼리에서 offset 받기, 기본값 1
      const limit = Number(req.query.limit) ? req.query.limit : 10; // url 쿼리에서 limit 받기, 기본값 10

      const sortKey = {
        created_date: 'createdAt',
        updated_date: 'updatedAt',
      };
      const sortOrderType = { asc: 1, desc: -1 };
      if (!Object.keys(sortKey).includes(sortBy)) {
        throw new Error(
          `잘못된 sort값 입니다. ['created_date', 'updated_date'] 중에서 선택해주세요`,
        );
      }
      if (!Object.keys(sortOrderType).includes(orderBy)) {
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
        sortBy: sortKey[sortBy],
        orderBy: sortOrderType[orderBy],
        offset,
        limit,
      };
      const orders = await orderService.getOrdersByAdmin(newQuery);
      res.status(200).json({ orders });
      //query없으면 전체반환
    } catch (e) {
      next(e);
    }
  }

  async getOrders(req, res, next) {
    try {
      const { currentUserId } = req;
      const orders = await orderService.getOrdersByUserId(currentUserId);
      res.status(200).json({ orders });
    } catch (err) {
      next(err);
    }
  }
  async getOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderByOrderId(orderId);
      res.status(200).json({ order });
    } catch (err) {
      next(err);
    }
  }
  async addOrder(req, res, next) {
    try {
      //user Id 받아옴 loginRequired 27 line 참조
      // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }
      const { currentUserId } = req;
      const { address, request, products } = req.body;
      const orderInfo = {
        userId: currentUserId,
        address,
        request,
        products,
      };
      const newOrder = await orderService.addOrder(orderInfo);
      res.status(201).json({ newOrder });
    } catch (err) {
      next(err);
    }
  }
  async setOrder(req, res, next) {
    try {
      // content-type 을 application/json 로 프론트에서
      // 설정 안 하고 요청하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }
      // params로부터 id를 가져옴
      const { currentUserId } = req;
      const { orderId } = req.params;
      const { address, request } = req.body;

      const toUpdate = {
        ...(address && { address }),
        ...(request && { request }),
      };

      // 사용자 정보를 업데이트함.
      const updateOrderInfo = await orderService.setOrder(
        currentUserId,
        orderId,
        toUpdate,
      );

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json({ updateOrderInfo });
    } catch (err) {
      next(err);
    }
  }
  async setOrderAdmin(req, res, next) {
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
      const statusType = ['배송 준비', '배송 중', '배송 완료'];
      if (!statusType.includes(status)) {
        throw new Error(
          `status '배송 준비', '배송 중', '배송 완료' 의 상태만 가질 수 있습니다.`,
        );
      }
      const toUpdate = {
        ...(address && { address }),
        ...(request && { request }),
        ...(status && { status }),
      };
      // 사용자 정보를 업데이트함.
      const updateOrderInfo = await orderService.setOrderByAdmin(
        orderId,
        toUpdate,
      );
      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json({ updateOrderInfo });
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const { currentUserId } = req;
      const { orderId } = req.params;
      const deletedResult = await orderService.deleteOrder(
        currentUserId,
        orderId,
      );
      res.status(200).json(deletedResult);
    } catch (err) {
      next(err);
    }
  }
  async deleteAdmin(req, res, next) {
    try {
      const { orderId } = req.params;
      const deletedResult = await orderService.deleteOrderByAdmin(orderId);
      res.status(200).json(deletedResult);
    } catch (err) {
      next(err);
    }
  }
}
const orderController = new OrderController();

export { orderController };
