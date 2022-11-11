import { customFetcher } from './fetcher.js';

const userService = {};

/**
 * 회원가입
 * @param { Object } obj required(email, fullName, password) / phoneNumber, address, role
 * @returns { json } response
 */
userService.register = async (obj) => {
  const { email, fullName, password, phoneNumber, address, role } = obj;

  const data = {
    email: email ?? null,
    fullName: fullName ?? null,
    password: password ?? null,
    phoneNumber: phoneNumber ?? null,
    address: address ?? null,
    role: role ?? null,
  };
  const reqObj = {
    target: '/register',
    method: 'POST',
    bodyObj: data,
  };
  try {
    const response = await customFetcher(reqObj);
    return await response.json();
  } catch (e) {
    return alert(e);
  }
};

/**
 *로그인
 * @param { Stirng } email
 * @param { String } password
 * @returns { json } response
 */
userService.login = async (email, password) => {
  const data = {
    email: email,
    password: password,
  };

  const reqObj = {
    target: '/login',
    method: 'POST',
    bodyObj: data,
  };

  try {
    const response = await customFetcher(reqObj);
    return await response.json();
  } catch (e) {
    return alert(e);
  }
};

/**
 *로그아웃
 * @returns { json } response
 */
userService.logout = async () => {
  const reqObj = {
    target: '/logout',
    method: 'POST',
  };

  try {
    const response = await customFetcher(reqObj);
    return await response.json();
  } catch (e) {
    return alert(e);
  }
};

/**
 * 로그인한 유저
 * @returns { json } response
 */
userService.getCurrentUser = async () => {
  const reqObj = {
    target: '/users',
    method: 'GET',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 로그인 유저 정보수정
 * @param {Object} obj  required(currentPassword) / fullName, password, address, phoneNumber, role
 * @returns { json } response
 */
userService.setUserInformation = async (obj) => {
  const { currentPassword, fullName, password, address, phoneNumber, role } =
    obj;

  const data = {
    currentPassword: currentPassword ?? null,
    fullName: fullName ?? null,
    password: password ?? null,
    address: address ?? null,
    phoneNumber: phoneNumber ?? null,
    role: role ?? null,
  };

  const reqObj = {
    target: `/users`,
    method: 'POST',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 로그인 유저의 정보 <수정>
 * @param {object} obj required(currentPassword) / 이외 선택사항
 * @returns { object } parsed json object
 */
userService.updateUserInformation = async (obj) => {
  const { currentPassword, address, phoneNumber, password } = obj;
  const data = {
    currentPassword,
    address,
    phoneNumber,
    password,
  };

  const reqObj = {
    target: '/users',
    method: 'PATCH',
    bodyObj: data,
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

/**
 * 회원 탈퇴
 * @returns { json } response
 */
userService.deleteUser = async () => {
  const reqObj = {
    target: `/users`,
    method: 'DELETE',
  };

  const response = await customFetcher(reqObj);
  return await response.json();
};

export default userService;
Object.freeze(userService);
