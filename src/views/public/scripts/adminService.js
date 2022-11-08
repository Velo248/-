import { customFetcher } from './fetcher.js';

const adminService = {};

//유저관련
adminService.getAllUser = async function () {
  const reqObj = {
    target: '/admin/users',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.getUserByUserId = async function (userId) {
  const reqObj = {
    target: `/admin/users/${userId}`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.getUserOrdersByUserId = async function (userId) {
  const reqObj = {
    target: `/admin/users/${userId}/orders`,
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.setUserInformationByUserId = async function (userId, obj) {
  const { currentPassword, fullName, password, address, phoneNumber, role } =
    obj;

  const data = {
    currentPassword: currentPassword,
    fullName: fullName ? fullName : null,
    password: password ? password : null,
    address: address ? address : null,
    phoneNumber: phoneNumber ? phoneNumber : null,
    role: role ? role : null,
  };

  const reqObj = {
    target: `/admin/users/${userId}`,
    method: 'PATCH',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.deleteUserByUserId = async function (userId) {
  const reqObj = {
    target: `/admin/users/${userId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

//주문관련
adminService.getAllOrders = async function () {
  const reqObj = {
    target: '/admin/orders',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.setOrderInformationByOrderId = async function (orderId, obj) {
  const { address, request, status } = obj;
  const data = {
    address: address || null,
    request: request || null,
    status: status || null,
  };

  const reqObj = {
    target: `/admin/orders/${orderId}`,
    method: 'PATCH',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.deleteOrderByOrderId = async function (orderId) {
  const reqObj = {
    target: `/admin/orders/${orderId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

//카테고리 관련
adminService.createCategory = async function (obj) {
  const { title, description, themeClass, imageKey } = obj;
  const data = {
    title: title,
    description: description,
    themeClass: themeClass,
    imageKey: imageKey,
  };

  const reqObj = {
    target: `/admin/categories/`,
    method: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.setCategoryByCategoryId = async function (categoryId, obj) {
  const { title, description, themeClass, imageKey } = obj;
  const data = {
    title: title,
    description: description || null,
    themeClass: themeClass || null,
    imageKey: imageKey || null,
  };

  const reqObj = {
    target: `/admin/categories/${categoryId}`,
    method: 'PATCH',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.deleteCategoryByCategoryId = async function (categoryId) {
  const reqObj = {
    target: `/admin/categories/${categoryId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

//상품 관련
adminService.createProduct = async function (obj) {
  const reqObj = {
    target: `/admin/products`,
    method: 'POST',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.setProductByProductId = async function (productId, obj) {
  const reqObj = {
    target: `/admin/products/${productId}`,
    method: 'POST',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.setProductInformationByProductId = async function (
  productId,
  obj,
) {
  const reqObj = {
    target: `/admin/products/${productId}`,
    method: 'PATCH',
    bodyObj: obj,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

adminService.deleteProductByProductId = async function (productId) {
  const reqObj = {
    target: `/admin/products/${productId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default adminService;
Object.freeze(adminService);
