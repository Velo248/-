import { customFetcher } from './fatcher';

const userService = {};

userService.register = async function (obj) {
  const { email, fullName, password, phoneNumber, address, role } = obj;
  const data = {
    email: email,
    fullName: fullName,
    password: password,
    phoneNumber: phoneNumber ? phoneNumber : null,
    address: address ? address : null,
    role: role ? role : null,
  };
  const reqObj = {
    target: '/register',
    medtod: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

userService.login = async function (email, password) {
  const data = {
    email: email,
    password: password,
  };
  const reqObj = {
    target: '/login',
    medtod: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

userService.getAllUser = async function () {
  const reqObj = {
    target: '/users',
    medtod: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

userService.getCurrentUser = async function () {
  const reqObj = {
    target: '/user',
    medtod: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

userService.getUserFromUserId = async function (userId) {
  const reqObj = {
    target: `/users/${userId}`,
    medtod: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

userService.getUserOrdersFromUserId = async function (userId) {
  const reqObj = {
    target: `/users/${userId}/orders`,
    medtod: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

userService.setUserInfomation = async function (userId, obj) {
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
    target: `/users/${userId}`,
    medtod: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default userService;
Object.freeze(userService);
