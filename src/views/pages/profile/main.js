import userService from '/public/scripts/userService.js';
import orderService from '/public/scripts/orderService.js';

const getCurrentUser = async () => {
  return await (
    await fetch(`/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  ).json();
};

const createUserSection = ({ fullName, email, phoneNumber }) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper flex-column';
  wrapper.innerHTML = `
        <div class="button">
          <a href="/profile-edit" class="edit-profile">내 정보 수정</a>
        </div>
        <div class="column">
            <div class="row">사용자명:</div>
            <div class="row username">${fullName}</div>
        </div>
        <div class="column">
            <div class="row">이메일:</div>
            <div class="row email">${email}</div>
        </div>
        <div class="column">
            <div class="row">전화번호:</div>
            <div class="row phone">${
              phoneNumber || '전화번호가 없습니다.'
            }</div>
        </div>
    `;
  return wrapper;
};
const createAddressSection = ({ address1, address2, postalCode }) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper address';
  if (!address1) {
    wrapper.innerHTML = `
        배송지정보
        <div>등록된 배송지가 없습니다.</div>
    `;
  } else {
    wrapper.innerHTML = `
            배송지정보
            <br />
            <div class="column">
                <div class="address_long">${address1}</div>
            </div>
            <div class="column">
                <div class="row postal_code">${postalCode}</div>
                <div class="row address_detail">${address2}</div>
            </div>
        `;
  }
  return wrapper;
};
const createOrderElement = ({ _id, status, totalPrice }) => {
  const orderColumn = document.createElement('div');
  orderColumn.className = 'order-table__column';
  orderColumn.innerHTML = `
        <div class="order-table__column-row">${_id}</div>
        <div class="order-table__column-row">${status}</div>
        <div class="order-table__column-row">${Number(
          totalPrice,
        ).toLocaleString('ko-kr')}</div>
    `;
  return orderColumn;
};

const init = async () => {
  const user = await getCurrentUser(); // userService.getCurrentUser로 변경 예정
  const { orders } = (await orderService.getOrdersByCurrentUser()) ?? [];

  const profileWrapper = document.querySelector('.profile');
  profileWrapper.innerHTML = '';
  profileWrapper.appendChild(createUserSection(user));

  const addressWrapper = document.querySelector('.address');
  addressWrapper.innerHTML = '';
  addressWrapper.appendChild(createAddressSection(user.address));

  const ordersWrapper = document.querySelector('.orders');
  orders?.forEach((order) =>
    ordersWrapper.appendChild(createOrderElement(order)),
  );
};

document.addEventListener('DOMContentLoaded', init);
