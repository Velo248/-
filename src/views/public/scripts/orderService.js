import { customFetcher } from './fetcher.js';

const orderService = {};

/**
 * 현재유저의 주문 내역
 * @returns { json } response
 */
orderService.getOrdersByCurrentUser = async () => {
  const reqObj = {
    target: '/orders',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 특정 주문 내역
 * @param { String } orderId 주문 아이디
 * @returns { json } response
 */
orderService.getOrderByOrderId = async (orderId) => {
  const reqObj = {
    target: `/orders/${orderId}`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 주문 생성
 * @param { Object } obj products [{ productId, quantity }], address { postalCode, address1, address2, receiverName, receiverPhoneNumber }
 * @returns { json } response
 */
orderService.createOrder = async (obj) => {
  const { products, address } = obj;

  const data = {
    products: products ?? null,
    address: address ?? null,
  };

  const reqObj = {
    target: `/orders`,
    method: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 주문 정보 수정
 * @param { String } orderId 주문 아이디
 * @param { Object } obj request, address
 * @returns { json } response
 */
orderService.setOrderInfomatinByOrderId = async (orderId, obj) => {
  const reqObj = {
    target: `/orders/${orderId}`,
    method: 'PATCH',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 주문 삭제
 * @param { Stirng } orderId 주문 아이디
 * @returns { json } response
 */
orderService.deleteOrderByOrderId = async (orderId) => {
  const reqObj = {
    target: `/orders/${orderId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default orderService;
Object.freeze(orderService);
