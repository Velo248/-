import { customFetcher } from './fetcher.js';

const cartService = {};

cartService.getCurrentUserCart = async function () {
  const reqObj = {
    target: '/carts',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

cartService.createCart = async function (orderSheets) {
  const reqObj = {
    target: '/carts',
    method: 'POST',
    bodyObj: orderSheets,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

cartService.updateCartItem = async function (toUpdateObj) {
  const reqObj = {
    target: '/carts',
    method: 'PATCH',
    bodyObj: toUpdateObj,
  };
  const response = await customFetcher(reqObj);
  return await response.json();
};

cartService.deleteCartItem = async function (toDelete) {
  const reqObj = {
    target: '/carts',
    method: 'DELETE',
    bodyObj: toDelete,
  };
  const response = await customFetcher(reqObj);
  return await response.json();
};

Object.freeze(cartService);
export default cartService;
