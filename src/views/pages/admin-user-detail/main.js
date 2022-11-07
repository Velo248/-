import { elementCreater, dateFormet } from '/public/scripts/util.js';
import productService from '/public/scripts/productService.js';
import categoryService from '/public/scripts/categoryService.js';
import userService from '/public/scripts/userService.js';

const $admin_user_wapper = document.querySelector('.admin_user_wapper');
const $user_dateil = document.querySelector('.user_dateil');

const getUser = async () => {
  const user = await userService.getUserFromUserId(
    sessionStorage.getItem('u_id'),
  );
  return user;
};

const pageRender = async () => {
  const user = await getUser();
  const { _id, fullName, email, createdAt, phoneNumber, address } = user;
  const { address1, address2, postalCode } = address;

  const createData = dateFormet(createdAt);
  const temp_html = `
    <div><span>${fullName}</span></div>
    <div><span>${email}</span></div>
    <div><span>${
      phoneNumber ? phoneNumber : '전화번호가 없습니다.'
    }</span></div>
    <div><span>${
      postalCode
        ? `<div>
          <p>우편번호: ${postalCode}</p>
          <p>메인 주소: ${address1}</p>
          <p>추가 주소: ${address2}</p>
        </div>`
        : '주소가 없습니다.'
    }</span></div>
    <div><span>${createData}</span></div>
  `;
  ('');

  elementCreater($user_dateil, temp_html);
  $user_dateil.setAttribute('data-key', _id);
};

//api 확인후 수정필요
const userOrderDirect = () => {
  const userId = $user_dateil.getAttribute('data-key');
  window.sessionStorage.setItem('u_id', userId);
  window.location.href = '/admin-main';
};

const clickEventMap = {
  user_order_bnt() {
    userOrderDirect();
  },
  back_admin_main_bnt() {
    window.sessionStorage.removeItem('u_id');
    window.location.href = '/admin-main';
  },
};

$admin_user_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});

const customFetcher = async (data) => {
  const { target, dataObj, method } = data;

  const res = await fetch(`/api/users/${target}`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(dataObj),
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }

  return res;
};
