import { customFetcher } from './fatcher.js';

const userService = {};

//회원가입
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
    method: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

//로그인
userService.login = async function (email, password) {
  const data = {
    email: email,
    password: password,
  };
  const reqObj = {
    target: '/login',
    method: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

//로그인 유저
userService.getCurrentUser = async function () {
  const reqObj = {
    target: '/user',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

//로그인 유저 정보수정
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
    method: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

//탈퇴
userService.deleteUser = async function (userId) {
  const reqObj = {
    target: `/users/${userId}`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default userService;
Object.freeze(userService);
