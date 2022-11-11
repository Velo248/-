import { customFetcher } from './fetcher.js';

const basketService = {};

basketService.getCurrentUserBaskets = async () => {
  const reqObj = {
    target: '/baskets',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

basketService.createBasket = async (orderSheets) => {
  const reqObj = {
    target: '/baskets',
    method: 'POST',
    bodyObj: orderSheets,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

basketService.updateBasketItem = async (toUpdateArray) => {
  const reqObj = {
    target: '/baskets',
    method: 'PATCH',
    bodyObj: { orderSheets: toUpdateArray },
  };
  const response = await customFetcher(reqObj);
  return await response.json();
};

basketService.deleteUserBaskets = async () => {
  const reqObj = {
    target: '/baskets',
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

basketService.deleteBasketItem = async (basketId) => {
  const reqObj = {
    target: `/baskets/${basketId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

Object.freeze(basketService);
export default basketService;
