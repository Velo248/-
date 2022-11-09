import { elementCreater, dateFormet } from '/public/scripts/util.js';
import adminService from '/public/scripts/adminService.js';

const $admin_order_wapper = document.querySelector('.admin_order_wapper');
const $list = document.querySelector('.list');

const userMap = {};

const setUserName = (orders, users) => {
  users.forEach((user) => {
    userMap[user._id] = user.fullName;
  });

  orders.orders.forEach((order) => {
    order.fullName = userMap[order.userId];
  });
  return orders;
};

const userNameMatch = (userName) => {
  return Object.keys(userMap).find((key) => userMap[key] === userName);
};

const orderDatail = (target) => {
  const orderId = target.parentNode.parentNode.getAttribute('id');
  sessionStorage.setItem('o_id', orderId);
  location.href = '/admin/order/detail';
};

const orderFiltering = async (target) => {
  const formData = new FormData(target);
  const formValue = formData.get('user_name');

  if (!formValue) return;

  const userId = userNameMatch(formValue);

  if (userId === undefined) {
    alert('검색한 유저의 주문정보가 없습니다.');
    await pageRender();
    return;
  }

  const userOrder = await adminService.getUserOrdersByUserId(userId);
  await pageRender(userOrder);
};

const clickEventMap = {
  back_admin_main_bnt: () => (location.href = '/admin'),
  all_order_list_bnt: async () => await pageRender(),
  order_detail_bnt: orderDatail,
};

const submitEventMap = {
  filter_form: orderFiltering,
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

const pageRender = async (filter) => {
  $list.innerHTML = '';

  const ordersResponse = filter ? filter : await adminService.getAllOrders();
  const usersResponse = await adminService.getAllUser();
  const orders = setUserName(ordersResponse, usersResponse);

  orders.orders.forEach((order) => {
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

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
