import { customFetcher } from './fetcher.js';

const productService = {};

/**
 * 모든 상품 정보
 * @returns { json } response
 */
productService.getAllProducts = async () => {
  const reqObj = {
    target: '/products',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 특정 조건의 모든 상품
 * @param { String } sortBy 날짜 정렬 / created_date or updated_date
 * @param { String } sortOrder 정렬 / asc or desc
 * @param { String } offset 조회시작 점
 * @param { String } limit 조회결과 최대 건수
 * @param { String } priceMax 조회결과 최대 가격
 * @param { String } priceMin 조회결과 최소 가격
 * @returns { json } response
 */
productService.getAllProductsWithOptions = async (
  sortBy,
  sortOrder,
  offset,
  limit,
  priceMax,
  priceMin,
) => {
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

/**
 * 특정 상품 정보
 * @param { String } productId 상품 아이디
 * @returns { json } response
 */
productService.getProductByProductId = async (productId) => {
  const reqObj = {
    target: `/products/${productId}`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default productService;
Object.freeze(productService);
