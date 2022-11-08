import { customFetcher } from './fatcher.js';

const categoryService = {};

categoryService.getAllCategories = async function () {
  const reqObj = {
    target: '/categories',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

categoryService.getCategoryInfomation = async function (categoryId) {
  const reqObj = {
    target: `/categories/${categoryId}`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

categoryService.addCategory = async function (obj) {
  const { title, description, themeClass, imageKey } = obj;

  const data = {
    title: title,
    description: description ? description : null,
    themeClass: themeClass ? themeClass : null,
    imageKey: imageKey ? imageKey : null,
  };

  const reqObj = {
    target: '/categories',
    method: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

categoryService.setCategoryInfomation = async function (categoryId, obj) {
  const { title, description, themeClass, imageKey } = obj;

  const data = {
    title: title,
    description: description ? description : null,
    themeClass: themeClass ? themeClass : null,
    imageKey: imageKey ? imageKey : null,
  };

  const reqObj = {
    target: `/categories/${categoryId}`,
    method: 'PATCH',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

categoryService.deleteCategory = async function (categoryId) {
  const reqObj = {
    target: `/categories/${categoryId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default categoryService;
Object.freeze(categoryService);
