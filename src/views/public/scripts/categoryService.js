import { customFetcher } from './fetcher.js';

const categoryService = {};

/**
 * 모든 카테고리 정보
 * @returns { json } response
 */
categoryService.getAllCategories = async () => {
  const reqObj = {
    target: '/categories',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 특정 카테고리 정보 확인
 * @param { String } categoryId 카테고리 아이디
 * @returns { json } response
 */
categoryService.getCategoryInformation = async (categoryId) => {
  const reqObj = {
    target: `/categories/${categoryId}`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 특정 카테고리의 모든 상품정보
 * @param { String } categoryId 카테고리 아이디
 * @returns { json } response
 */
categoryService.getAllProductByCategoryId = async (categoryId) => {
  const reqObj = {
    target: `/categories/${categoryId}/products`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default categoryService;
Object.freeze(categoryService);
