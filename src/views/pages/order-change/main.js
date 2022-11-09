import orderService from '/public/scripts/orderService.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';

const createOrderRow = ({ summaryTitle, totalPrice, status }) => {
  const orderRow = document.createElement('div');
  orderRow.className = 'row';
  orderRow.innerHTML = `
        <span class="order_summary">${summaryTitle}</span>
        <span class="column order_status">${status}</span>
        <span class="column order_price">${totalPrice.toLocaleString(
          'ko-kr',
        )}</span>
    `;
  return orderRow;
};

const createDeliveryInfo = ({
  address: {
    receiverName,
    receiverPhoneNumber,
    address1,
    address2,
    postalCode,
  },
  status,
}) => {
  const deliveryInfo = document.createElement('div');
  deliveryInfo.classname = 'delivery_info';
  deliveryInfo.innerHTML = `
            <h4>배송 정보</h4>
            <div class="info flex-column">
              <div class="line">
                <span>이름</span>
                <span class="receiver_name">${receiverName}</span>
              </div>
              <div class="line">
                <span>주소</span>
                <span class="receiver_address"
                  >${postalCode + ' ' + address1 + ' ' + address2}</span
                >
              </div>
              <div class="line">
                <span>연락처</span>
                <span class="receiver_phone_number">${receiverPhoneNumber}</span>
              </div>
              <div class="line">
                <span>배송상태</span>
                <span class="delivery_status">${status}</span>
              </div>`;
  return deliveryInfo;
};

const btnActivityChanger = () => {
  const doneBtn = document.querySelector('.done_btn');
  const cancelBtn = document.querySelector('.cancel_btn');
  doneBtn.disabled = !doneBtn.disabled;
  cancelBtn.disabled = !cancelBtn.disabled;
  return;
};

const finishChangeEventHandler = (orderId, toUpdateObj) => async (e) => {
  e.preventDefault();
  btnActivityChanger();
  if (
    !toUpdateObj.address.address1 ||
    !toUpdateObj.address.receiverName ||
    !toUpdateObj.address.receiverPhoneNumber
  ) {
    alert('배송 정보를 모두 입력해주세요');
  } else {
    if (confirm('배송정보 수정을 마치시겠습니까?')) {
      const response = await orderService.setOrderInfomatinByOrderId(
        orderId,
        toUpdateObj,
      );
      if (response.updateOrderInfo) {
        alert('수정이 완료되었습니다');
        location.href = '/pay-history';
      }
    }
  }
  btnActivityChanger();
};
const cancleBtnEventHandler = (orderId) => (e) => {
  btnActivityChanger();
  if (confirm('수정을 취소하시겠습니까?')) {
    location.href = `/orders/${orderId}`;
  }
  btnActivityChanger();
};

const init = async () => {
  loggedInOnlyPageProtector();
  const orderId = location.pathname.split('/')[2];

  const { order } = await orderService.getOrderByOrderId(orderId);

  const orderWrapper = document.querySelector('.order_wrapper');
  const deliveryDetail = document.querySelector('.delivery_detail');

  orderWrapper.appendChild(createOrderRow(order));
  deliveryDetail.appendChild(createDeliveryInfo(order));

  const addressLong = document.querySelector('.receiver_address_long');
  const addressDetail = document.querySelector('.receiver_address_detail');
  const postalCode = document.querySelector('.receiver_postal_code');
  const receiverName = document.querySelector('.receiver_name');
  const receiverPhone = document.querySelector('.receiver_phone');

  addressLong.value = order.address.address1;
  addressDetail.value = order.address.address2;
  postalCode.value = order.address.postalCode;
  receiverName.value = order.address.receiverName;
  receiverPhone.value = order.address.receiverPhoneNumber;

  const addressSearchBtn = document.querySelector('.address_search');
  addressSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: ({ zonecode, address }) => {
        addressLong.value = address;
        postalCode.value = zonecode;
        addressDetail.disabled = false;
        addressDetail.focus();
        addressDetail.placeholder = '상세 주소를 입력해주세요';
      },
    }).open();
  });

  const doneBtn = document.querySelector('.done_btn');
  const cancelBtn = document.querySelector('.cancel_btn');

  const toUpdateObj = {
    address: {
      address1: addressLong.value,
      address2: addressDetail.value,
      postalCode: postalCode.value,
      receiverName: receiverName.value,
      receiverPhoneNumber: receiverPhone.value,
    },
  };

  doneBtn.addEventListener(
    'click',
    finishChangeEventHandler(orderId, toUpdateObj),
  );

  cancelBtn.addEventListener('click', cancleBtnEventHandler(orderId));
};

document.addEventListener('DOMContentLoaded', init);
