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
  async getOrdersByUserId(userId) {
    const orders = await this.orderModel.findByUserId(userId);
    return orders;
  }
  //GET
  //orderId 기준으로 생성된 주문 가져오기
  async getOrderByOrderId(orderId) {
    const order = await this.orderModel.findOneByOrderId(orderId);
    return order;
  }
  //POST
  //주문
  async addOrder(orderInfo) {
    const { userId, address, request, products } = orderInfo;
    const orders = [];

    for (const product of products) {
      //현재 선택된 itemId, 사려는 갯수
      const { productId, quantity } = product;
      //itemId로 Model에서 가져오기
      const productData = await this.productModel.findById(productId);
      if (!productData) {
        throw new Error(`해당 ${productId}의 상품id를 찾을 수 없습니다.`);
      }
      //가격, 수량 가져오기
      const { price, inventory } = productData;
      //수량체크
      const isCanOrder = inventory >= quantity ? true : false;
      //뺄수없으면 에러
      if (!isCanOrder) {
        throw new Error(`사려는 양보다 수량이 적습니다 `);
      }
      //사려는 물건 x 수량 계산
      const priceCount = price * quantity;
      const { title } = productData;
      orders.push({ productId, inventory, quantity, priceCount, title });
    }
    let sumPrice = 0;
    let summaryTitle = '';
    //산만큼 수량 빼주기,
    for (const order of orders) {
      const { productId, inventory, quantity, priceCount, title } = order;
      const newProduct = { inventory: inventory - quantity };
      await this.productModel.update({
        productId,
        update: newProduct,
      });
      //사려는 총 합 계산
      sumPrice += priceCount;
      summaryTitle =
        orders.length === 1
          ? `${title} ${quantity}개`
          : `${title} 외 ${orders.length}종`;
    }
    //카트지우기? 일단 비워놔
    //유저 정보 저장
    const newOrderInfo = {
      userId,
      address,
      request,
      summaryTitle,
      totalPrice: sumPrice,
    };
    const createdNewOrder = await this.orderModel.create(newOrderInfo);
    //summaryTitle넣어주기<-
    return createdNewOrder;
  }
  //주문 수정
  async setOrderByAdmin(orderId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findOneByOrderId(orderId);
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
  async setOrder(userId, orderId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findOneByOrderId(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error('update error : 해당 주문을 찾을 수 없습니다.');
    }
    if (order.userId !== userId) {
      throw new Error('이 주문에 접근할 수 없습니다.');
    }
    // 업데이트 진행
    order = await this.orderModel.update({
      orderId,
      update: toUpdate,
    });

    return order;
  }
  //주문 삭제
  async deleteOrderByAdmin(orderId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findOneByOrderId(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error('remove error : 해당 주문을 찾을 수 없습니다.');
    }
    // 업데이트 진행
    const filter = { _id: orderId };
    order = await this.orderModel.deleteOne(filter);
    return order;
  }
  async deleteOrder(userId, orderId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let order = await this.orderModel.findOneByOrderId(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error('remove error : 해당 주문을 찾을 수 없습니다.');
    }
    if (order.userId !== userId) {
      throw new Error('이 주문에 접근할 수 없습니다.');
    }
    // 업데이트 진행
    const filter = { _id: orderId };
    order = await this.orderModel.deleteOne(filter);

    return order;
  }
  async getOrdersByAdmin(query) {
    const { sortBy, orderBy, limit, offset } = query;
    const countOrders = await this.orderModel.getCount();
    const divideCount = Math.ceil(countOrders / limit);

    //페이지 조건 검사
    if (offset > countOrders) {
      throw new Error(`offset 범위는 1-${divideCount}입니다.`);
    }

    const projection = {};
    const sort = { [sortBy]: orderBy };
    const options = { skip: limit * (offset - 1), limit: limit };
    const orders = await this.orderModel.find(query, projection, sort, options);
    return orders;
  }
  async getOrdersByAdmin(query) {
    const orders = await this.orderModel.findFilteredBySortAndOrders(query);
    return orders;
  }
}

const orderService = new OrderService(orderModel, productModel);

export { orderService };
