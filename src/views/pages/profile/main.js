// user profile page가 가져야 할 기능
// 1. 현재 사용자의 정보를 가져온다 or 가지고 있는 정보를 그린다.
// 2. 현재 사용자 정보를 통해 주문정보를 가져와서 그린다.
// 3. 각 주문번호를 클릭 시, 주문 상세 페이지로 넘어간다.
// 4. 내 정보 수정을 클릭 시, profileEdit으로 연결한다.

// test용 로그인 토큰 확보
const testLogin = async () => {
  const { token } = await (
    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'elice1@test.com',
        password: '1234',
      }),
    })
  ).json();

  return token;
};

const getCurrentUser = async () => {
  // const token = sessionStorage.getItem('token');

  const token = await testLogin();
  const user = await (
    await fetch('/api/user', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  ).json();

  return user;
};

const getOrders = async () => {
  const token = await testLogin();
  const orders = await (
    await fetch('/api/orderlist/user', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  ).json();

  return orders;
};

// logged in only page
const init = async () => {
  const user = await getCurrentUser();

  const username = document.querySelector('.username');
  const email = document.querySelector('.email');
  const phone = document.querySelector('.phone');
  const addressLong = document.querySelector('.address-long');
  const addressDetail = document.querySelector('.address-detail');
  const postalCode = document.querySelector('.postal-code');

  username.innerText = user.fullName;
  email.innerText = user.email;
  phone.innerText = user.phone;
  if (user.address) {
    addressLong.innerText = user.address.address1;
    addressDetail.innerText = user.address.address2;
    postalCode.innerText = user.address.postalCode;
  }

  const orderTable = document.querySelector('.order-table');
  orderTable.innerHTML = '';

  const orders = await getOrders();

  console.log(orders);
  orderTable.innerHTML = '';
  orders?.forEach(({ _id, status, price }) => {
    const orderColumn = document.createElement('div');
    orderColumn.className = 'order_table_column';
    orderColumn.innerHTML = `
        <div class="order_table__column-row">
            <a href="/orders">${_id}</a>
        </div>
        <div class="order_table__column-row">${status}</div>
        <div class="order_table__column-row">${price.toLocaleString(
          'ko-kr',
        )}</div>
    `;
    orderTable.insertAdjacentElement('afterbegin', orderColumn);
  });
};

document.addEventListener('DOMContentLoaded', init);
