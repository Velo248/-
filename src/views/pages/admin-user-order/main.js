import { elementCreater, dateFormet } from '/public/scripts/util.js';
import adminService from '/public/scripts/adminService.js';

const $admin_order_wapper = document.querySelector('.admin_order_wapper');
const $list = document.querySelector('.list');

const userMap = {};

const getOrdersFilter = async () => {
  const orders = await adminService.getUserOrdersByUserId(
    sessionStorage.getItem('filter_user'),
  );
  return orders;
};

const getUsers = async () => {
  const users = await adminService.getAllUser();
  return users;
};

const setUserName = (orders, users) => {
  users.forEach((user) => {
    userMap[user._id] = user.fullName;
  });

  orders.forEach((order) => {
    order.fullName = userMap[order.userId];
  });
  return orders;
};

const pageRender = async () => {
  const ordersResponse = await getOrdersFilter();

  if (ordersResponse.length === 0) {
    const temp_html = `
      <div><span>해당 유저는 주문정보가 없습니다.</span></div>
    `;
    elementCreater($list, temp_html);
    return;
  }
  const usersResponse = await getUsers();
  const orders = setUserName(ordersResponse, usersResponse);

  orders.forEach((order) => {
    const { _id, fullName, status, totalPrice, createdAt } = order;
    const createData = dateFormet(createdAt);

    const temp_html = `
    <div id=${_id} class="list_container">
      <div><span>${fullName}</span></div>
      <div><span>${_id}</span></div>
      <div><span>${createData}</span></div>
      <div><span>${totalPrice}</span></div>
      <div><span>${status}</span></div>
      <div><button class='order_detail_bnt'>상세</button></div>
    </div>
    `;

    elementCreater($list, temp_html);
  });
};

const orderDatail = (target) => {
  const orderId = target.parentNode.parentNode.getAttribute('id');
  sessionStorage.setItem('o_id', orderId);
  location.href = '/admin/order/detail';
};

const orderFiltering = async (target) => {
  const formData = new FormData(target);

  const userId = Object.keys(userMap).find(
    (key) => userMap[key] === formData.get('user_name'),
  );
  sessionStorage.setItem('filter_user', userId);
  location.href = '/admin/user/order';
};

const clickEventMap = {
  back_admin_main_bnt() {
    location.href = '/admin';
  },
  async all_order_list_bnt() {
    sessionStorage.removeItem('filter_user');
    location.href = '/admin/order/list';
  },
  order_detail_bnt(e) {
    orderDatail(e);
  },
};

const submitEventMap = {
  filter_form(e) {
    orderFiltering(e);
  },
};

$admin_order_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

$admin_order_wapper.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!submitEventMap[e.target.className]) return;

  submitEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
