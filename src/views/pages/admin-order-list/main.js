const $admin_order_wapper = document.querySelector('.admin_order_wapper');
const $list = document.querySelector('.list');
const userObj = {};

const getOrders = async () => {
  const data = {
    target: '/admin/orders',
    method: 'GET',
  };

  const response = await customFetcher(data);
  return await response.json();
};

const getUsers = async () => {
  const data = {
    target: '/users',
    method: 'GET',
  };

  const response = await customFetcher(data);
  return await response.json();
};

const dateFormet = (date) => {
  return `${date.substring(0, 10)} ${date.substring(11, 16)}`;
};

const elementCreater = (current, add) => {
  current.innerHTML += add;
};

const setUserName = (orders, users) => {
  users.forEach((user) => {
    userObj[user._id] = user.fullName;
  });

  orders.orders.forEach((order) => {
    order.fullName = userObj[order.userId];
  });

  return orders;
};

const pageRender = async () => {
  const ordersResponse = await getOrders();
  const usersResponse = await getUsers();
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

const orderDatail = (target) => {
  const orderId = target.parentNode.parentNode.getAttribute('id');
  window.sessionStorage.setItem('o_id', orderId);
  window.location.href = '/admin-order-detail';
};

const clickEventMap = {
  back_admin_main_bnt() {
    window.location.href = '/admin-main';
  },
  all_order_list_bnt() {
    async () => await pageRender();
  },
  order_detail_bnt(e) {
    orderDatail(e);
  },
};

$admin_order_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});

const customFetcher = async (data) => {
  const { target, dataObj, method } = data;

  const res = await fetch(`/api${target}`, {
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
