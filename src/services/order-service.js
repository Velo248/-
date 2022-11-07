import { orderModel } from '../db';
import { productModel } from '../db';

class OrderService {
  constructor(orderModel, productModel) {
    this.orderModel = orderModel;
    this.productModel = productModel;
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
    const { userId, address, request, items } = orderInfo;
    const orders = [];
    for (const item of items) {
      //현재 선택된 itemId, 사려는 갯수
      const { itemId, count } = item;
      //itemId로 Model에서 가져오기
      const product = await this.productModel.findById(itemId);
      if (!product) {
        throw new Error(`해당 ${itemId}의 상품id를 찾을 수 없습니다.`);
      }
      //가격, 수량 가져오기
      const { price, inventory } = product;
      //수량체크
      const isCanOrder = inventory >= count ? true : false;
      //뺄수없으면 에러
      if (!isCanOrder) {
        throw new Error(`사려는 양보다 수량이 적습니다 `);
      }
      //사려는 물건 x 수량 계산
      const priceCount = price * count;
      const { title } = product;
      orders.push({ itemId, inventory, count, priceCount, title });
    }
    let sumPrice = 0;
    let summaryTitle = '';
    //산만큼 수량 빼주기,
    for (const order of orders) {
      const { itemId, inventory, count, priceCount, title } = order;
      const newProduct = { inventory: inventory - count };
      await this.productModel.update({
        productId: itemId,
        update: newProduct,
      });
      //사려는 총 합 계산
      sumPrice += priceCount;
      summaryTitle += `${title} ,${count}개\n `;
    }
    //카트지우기? 일단 비워놔
    //유저 정보 저장
    const newOrderInfo = {
      userId,
      address,
      request: '테스트 메시징',
      summaryTitle,
      totalPrice: sumPrice,
    };
    const createdNewOrder = await this.orderModel.create(newOrderInfo);
    //summaryTitle넣어주기<-
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
    const orders = await this.orderModel.findFilteredBySortAndOrders(query);

    return orders;
  }

  //pagiNation시 총 페이지수가 필요할때 만들어줄꺼
  ///api/admin/orders/count 로 생각중임
  async getOrdersByAdminCount(query) {
    const [orderTotal, orders] = await Promise.all([
      this.orderModel.getOrdersCount(),
      this.orderModel.findAll(query),
    ]);
    const { limit } = query;
    const totalOrderPage = Math.ceil(orderTotal / limit);
    // 총페이지필요하면 그때
    return totalOrderPage;
  }
}

const orderService = new OrderService(orderModel, productModel);

export { orderService };
