import { customFetcher } from './fatcher.js';

const orderService = {};

orderService.getOrdersByCurrentUser = async function () {
  const reqObj = {
    target: '/orders',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

orderService.getOrderByOrderId = async function (orderId) {
  const reqObj = {
    target: `/orders/${orderId}`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

orderService.createOrder = async function (obj) {
  const reqObj = {
    target: `/orders`,
    method: 'POST',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

orderService.setOrderInfomatinByOrderId = async function (orderId, obj) {
  const reqObj = {
    target: `/orders/${orderId}`,
    method: 'PATCH',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

orderService.deleteOrderByOrderId = async function (orderId) {
  const reqObj = {
    target: `/orders/${orderId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default orderService;
Object.freeze(orderService);
