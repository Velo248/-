import { orderModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  //GET
  //주문가져오기
  async getOrders() {
    const orders = await this.orderModel.findAll();
    return orders;
  }

  //GET
  //userId 생성된 주문 가져오기
  async getOrderByUserId(userId) {
    const order = await this.orderModel.findByUserId(userId);
    return order;
  }
  //GET
  //orderId 기준으로 생성된 주문 가져오기
  async getOrderByOrderId(orderId) {
    const order = await this.orderModel.findByOrderId(orderId);
    return order;
  }
  //POST
  //주문
  async addOrder(orderInfo) {
    const { userId, summaryTitle, totalPrice, address, request, status } =
      orderInfo;
    const newOrderInfo = {
      userId,
      summaryTitle,
      totalPrice,
      address,
      request,
      status,
    };
    const createdNewOrder = await this.orderModel.create(newOrderInfo);
    return createdNewOrder;
  }
  //주문 수정
  async setOrder(orderId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findByOrderId(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error('update error : 해당 주문을 찾을 수 없습니다.');
    }
    // 업데이트 진행
    order = await this.orderModel.update({
      orderId,
      update: toUpdate,
    });

    return order;
  }

  //DELETE
  //주문 삭제
  async deleteOrder(orderId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findByOrderId(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error('remove error : 해당 주문을 찾을 수 없습니다.');
    }
    // 업데이트 진행
    order = await this.orderModel.remove(orderId);

    return order;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
