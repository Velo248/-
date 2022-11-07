import { elementCreater, dateFormet } from '/public/scripts/util.js';
import adminService from '/public/scripts/adminService.js';

const $admin_user_wapper = document.querySelector('.admin_user_wapper');
const $user_dateil = document.querySelector('.user_dateil');

const getUser = async () => {
  const user = await adminService.getUserByUserId(
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
  console.log(userId);
  sessionStorage.setItem('u_id', userId);
  location.href = '/admin/user/order';
};

const clickEventMap = {
  user_order_bnt() {
    userOrderDirect();
  },
  back_admin_main_bnt() {
    sessionStorage.removeItem('u_id');
    location.href = '/admin/user/list';
  },
};

$admin_user_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
