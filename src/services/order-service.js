import { orderModel } from '../db';
import { productModel } from '../db';

class OrderService {
  constructor(orderModel, productModel) {
    this.orderModel = orderModel;
    this.productModel = productModel;
  }

  //GET
  //주문가져오기
  async getOrders(query) {
    const orders = await this.orderModel.findAll(query);
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
    const { userId, address, request, items } = orderInfo;
    const orders = [];
    for (const item of items) {
      //현재 선택된 itemId, 사려는 갯수
      const { itemId, count } = item;
      //itemId로 Model에서 가져오기
      const product = await this.productModel.findById(itemId);
      //가격, 수량 가져오기
      const { price, inventory } = product;
      //수량체크
      const isCanOrder = inventory >= count ? true : false;
      //뺄수있을때 수량빼주기
      if (!isCanOrder) {
        throw new Error(`사려는 양보다 수량이 적습니다 `);
      }
      //사려는 물건 x 수량 계산
      const priceCount = price * count;
      const productName = product.manufacturer;
      orders.push({ itemId, inventory, count, priceCount, productName });
    }
    let sumPrice = 0;
    let summaryTitle = '';
    //산만큼 수량 빼주기,
    for (const order of orders) {
      const { itemId, inventory, count, priceCount, productName } = order;
      const newProduct = { inventory: inventory - count };
      await this.productModel.update({
        productId: itemId,
        update: newProduct,
      });
      //사려는 총 합 계산
      sumPrice += priceCount;
      summaryTitle += `${productName} ,${count}개\n `;
    }
    //카트지우기? 일단 비워놔
    //
    //유저 정보 저장

    //summaryTitle넣어주기<-
    const newOrderInfo = {
      userId,
      address,
      request: '테스트 메시징',
      summaryTitle,
      totalPrice: sumPrice,
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

  async getOrdersByAdmin(query) {
    const [orderTotal, orders] = await Promise.all([
      this.orderModel.getOrdersCount(),
      this.orderModel.findAll(query),
    ]);
    const { limit } = query;
    // const totalOrderPage = Math.ceil(orderTotal / limit);
    // 총페이지필요하면 그때
    return { orders };
  }
}

const orderService = new OrderService(orderModel, productModel);

export { orderService };
