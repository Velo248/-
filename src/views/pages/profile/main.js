import userService from '/public/scripts/userService.js';
import orderService from '/public/scripts/orderService.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';

const createUserSection = ({ fullName, email, phoneNumber }) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'flex-column';
  wrapper.innerHTML = `
            <div>
              <label>사용자명</label>
              <input type="text" class="username" value="${fullName}" readonly></input>
            </div>
            <div>
              <label>이메일</label>
              <input type="text" class="email" value="${email}" readonly></input>
            </div>
            <div>
              <label>전화번호</label>
              <input type="tel" class="phone" value="${
                phoneNumber || '전화번호가 없습니다.'
              }" readonly></input>
            </div>
    `;
  return wrapper;
};
const createAddressSection = ({ address1, address2, postalCode }) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'address';
  if (!address1) {
    wrapper.innerHTML = `
          <em>배송지정보</em>
          <div><div>등록된 배송지가 없습니다.</div></div>
    `;
  } else {
    wrapper.innerHTML = `
          <em>배송지정보</em>
          <div>
            <div class="address_long">${address1}</div>
            <div class="flex">
              <div class="postal_code">${postalCode}</div>&nbsp;&nbsp;
              <div class="address_detail">${address2}</div>
            </div>
          </div>
        `;
  }
  return wrapper;
};
const createOrderElement = ({ _id, status, totalPrice }) => {
  const orderColumn = document.createElement('div');
  orderColumn.innerHTML = `
        <span>${_id}</span>
        <span>${status}</span>
        <span>
          ${Number(totalPrice).toLocaleString('ko-kr')}
        </span>
    `;
  return orderColumn;
};

const init = async () => {
  loggedInOnlyPageProtector();
  const user = await userService.getCurrentUser(); // userService.getCurrentUser로 변경 예정
  const { orders } = (await orderService.getOrdersByCurrentUser()) ?? {
    orders: [],
  };

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
