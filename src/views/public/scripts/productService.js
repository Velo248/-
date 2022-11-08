import { customFetcher } from './fatcher.js';

const productService = {};

productService.getAllProducts = async function () {
  const reqObj = {
    target: '/products',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

productService.getAllProductsWithOptions = async function (obj) {
  const { sortBy, sortOrder, offset, limit, priceMax, priceMin } = obj;

  let target = '/products?';
  sortBy ? (target += `sortBy=${sortBy}&`) : (target = target);
  sortOrder ? (target += `sortOrder=${sortOrder}&`) : (target = target);
  offset ? (target += `offset=${offset}&`) : (target = target);
  limit ? (target += `limit=${limit}&`) : (target = target);
  priceMax ? (target += `priceMax=${priceMax}&`) : (target = target);
  priceMin ? (target += `priceMin=${priceMin}&`) : (target = target);

  const reqObj = {
    target: target,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

productService.getProductByProductId = async function (productId) {
  const reqObj = {
    target: `/products/${productId}`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

productService.addProduct = async function (obj) {
  const reqObj = {
    target: `/products`,
    method: 'POST',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

productService.setProductInfomation = async function (productId, obj) {
  const reqObj = {
    target: `/products/${productId}`,
    method: 'PATCH',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

productService.deleteProductByProductId = async function (productId) {
  const reqObj = {
    target: `/products/${productId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default productService;
Object.freeze(productService);
