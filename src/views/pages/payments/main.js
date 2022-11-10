import userService from '/public/scripts/userService.js';
import orderService from '/public/scripts/orderService.js';
import { getLocalStorageItem, parsePrice } from '/public/scripts/util.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';

const getOrderList = () => {
  return getLocalStorageItem('orderList');
};

const createOrderItem = (product, quantity) => {
  const itemWrapper = document.createElement('div');
  itemWrapper.className = 'flex-justify-between order';
  itemWrapper.innerHTML = `
  <div>
  <div class="img_wrap img-s">
    <img
      src="${product.imageKey}"
      alt="${product.title}"
      class="product_image"
    />
  </div>
  </div>
    <div class="product_title">${product.title}</div>
    <div class="product_price">${product.price.toLocaleString('ko-kr')}</div>
    <div class="product_count">${quantity}</div>
  `;
  return itemWrapper;
};

const paintOrderItems = (root, orderItems) => {
  orderItems?.forEach(async (orderItem) => {
    const product = await (
      await fetch(`/api/products/${orderItem.productId}`)
    ).json();
    const orderDiv = createOrderItem(product, orderItem.quantity);
    root.appendChild(orderDiv);
  });
  return;
};

const paintUserSection = (root, user) => {
  const template = document.createElement('div');
  template.innerHTML = `<em>주문정보</em>
    <div class="flex-column-center">
      <span>이름</span>
      <span class="username">${user?.fullName}</span>
    </div>
    <div class="flex-column-center">
      <span>주소</span>
      <span class="postal_code">${
        user?.address?.postalCode || '정보 없음'
      }</span>
      <span class="address">${
        user?.address?.address1 + user?.address?.address2 || '정보 없음'
      }</span>
    </div>
    <div class="flex-column-center">
      <span>연락처</span>
      <span class="phone">${user.phoneNumber || '전화번호가 없습니다'}</span>
    </div>
    `;
  root.appendChild(template);
  return;
};

const getTotalPrice = () => {
  const orders = document.querySelectorAll('.order');
  let totalPrice = 0;
  orders.forEach((order) => {
    const price = parsePrice(order.querySelector('.product_price').textContent);
    const count = Number(order.querySelector('.product_count').textContent);
    totalPrice += price * count;
  });
  return totalPrice.toLocaleString('ko-kr');
};

const getSelectedPaymentType = () => {
  const paymentTypes = document.querySelectorAll('.payment_type');
  return [...paymentTypes].filter((radio) => radio.checked)[0];
};

const updateOrderObj = (orderObj) => {
  const addressLong = document.querySelector('.receiver_address_long');
  const addressDetail = document.querySelector('.receiver_address_detail');
  const postalCode = document.querySelector('.receiver_postal_code');
  const receiverName = document.querySelector('.receiver_name');
  const receiverPhone = document.querySelector('.receiver_phone');
  const deleveryMsg = document.querySelector('.delevery_message');
  orderObj = {
    ...orderObj,
    address: {
      postalCode: postalCode.value,
      address1: addressLong.value,
      address2: addressDetail.value,
      receiverName: receiverName.value,
      receiverPhoneNumber: receiverPhone.value,
    },
    request: deleveryMsg.value || '배송 전 연락 바랍니다',
  };
  return orderObj;
};
const paymentBtnEventHandler = (orderObj) => async (e) => {
  e.target.disabled = true;
  orderObj = updateOrderObj(orderObj);
  console.log(orderObj);
  const selectedPaymentType = getSelectedPaymentType();
  if (
    !orderObj.address.address1 ||
    !orderObj.address.receiverPhoneNumber ||
    !orderObj.address.receiverName
  ) {
    alert('배송 정보를 모두 입력해 주세요');
    e.target.disabled = false;
    return;
  } else if (!selectedPaymentType) {
    alert('결제 방법을 선택해 주세요');
    e.target.disabled = false;
    return;
  } else {
    if (confirm('선택한 방법으로 결제를 진행하시겠습니까?')) {
      const response = await orderService.createOrder(orderObj);

      if (response.newOrder) {
        alert('결제가 완료되었습니다. 결제 내역 페이지로 이동합니다');
        localStorage.removeItem('orderList');
        location.href = '/pay-history';
      }
    }
  }
  e.target.disabled = false;
  return;
};

const init = async () => {
  loggedInOnlyPageProtector();
  const orderList = getOrderList() ?? [];
  if (orderList.length < 1) {
    alert('주문할 내역이 없습니다');
    location.href = '/';
  }

  const orders = document.querySelector('.orders');
  const userInfo = document.querySelector('.user_info');
  orders.innerHTML = `
      <div class="flex-justify-between">
        <div>-</div>
        <div>제품 이름</div>
        <div>가격</div>
        <div>수량</div>
      </div>`;
  userInfo.innerHTML = '';

  const orderTotalPrice = document.querySelector('.order_total_price');
  const user = await userService.getCurrentUser();

  paintOrderItems(orders, orderList);
  paintUserSection(userInfo, user);
  setTimeout(() => (orderTotalPrice.innerText = getTotalPrice()), 1000);

  const addressSearchBtn = document.querySelector('.address_search');
  const addressLong = document.querySelector('.receiver_address_long');
  const addressDetail = document.querySelector('.receiver_address_detail');
  const postalCode = document.querySelector('.receiver_postal_code');
  const receiverName = document.querySelector('.receiver_name');
  const receiverPhone = document.querySelector('.receiver_phone');

  addressSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: ({ zonecode, address }) => {
        addressLong.value = address;
        postalCode.value = zonecode;
        addressDetail.disabled = false;
        addressDetail.focus();
        addressDetail.placeholder = '상세 주소를 입력해 주세요.';
      },
    }).open();
  });

  const orderObj = {
    products: orderList,
    address: {
      postalCode: postalCode.value,
      address1: addressLong.value,
      address2: addressDetail.value,
      receiverName: receiverName.value,
      receiverPhoneNumber: receiverPhone.value,
    },
  };

  const paymentBtn = document.querySelector('.payment_button');
  paymentBtn.addEventListener('click', paymentBtnEventHandler(orderObj));
};

document.addEventListener('DOMContentLoaded', init);
