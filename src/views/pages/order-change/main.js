import orderService from '/public/scripts/orderService.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';
import { errorUtil } from '/public/scripts/util.js';

const createOrderRow = ({ summaryTitle, totalPrice, status }) => {
  const orderRow = document.createElement('div');
  orderRow.className = 'row grid-3';
  orderRow.innerHTML = `
        <span class="column order_summary">${summaryTitle}</span>
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
            <em>배송 정보</em>
            <div class="info flex-column row">
              <div class="line">
                <b>이름</b>
                <input type="text" required value="${receiverName}" class="receiver_name" />
              </div>
              <div class="line address_field flex">
                <b>주소</b>
                <div>
                  <div>
                    <input type="text" class="receiver_postal_code" disabled required value="${postalCode}" />
                    <button type="button" class="address_search small bg-darkgray">주소 검색</button>
                  </div>
                  <div>
                    <input type="text" class="receiver_address_long" disabled required value="${address1}" />
                    <input type="text" class="receiver_address_detail" disabled required value="${address2}" />
                  </div>
                </div>
              </div>
              <div class="line">
                <b>연락처</b>
                <input type="text" class="receiver_phone" required value="${receiverPhoneNumber}" />
              </div>
              <div class="line">
                <b>배송상태</b>
                <span class="delivery_status">${status}</span>
              </div>`;
  return deliveryInfo;
};

const updateOrderObj = (orderObj) => {
  const addressLong = document.querySelector('.receiver_address_long');
  const addressDetail = document.querySelector('.receiver_address_detail');
  const postalCode = document.querySelector('.receiver_postal_code');
  const receiverName = document.querySelector('.receiver_name');
  const receiverPhone = document.querySelector('.receiver_phone');
  orderObj = {
    ...orderObj,
    address: {
      postalCode: postalCode.value,
      address1: addressLong.value,
      address2: addressDetail.value,
      receiverName: receiverName.value,
      receiverPhoneNumber: receiverPhone.value,
    },
  };
  return orderObj;
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
    if (errorUtil.isValidPhoneNumber(toUpdateObj.receiverPhone)) {
      if (confirm('배송정보 수정을 마치시겠습니까?')) {
        toUpdateObj = updateOrderObj(toUpdateObj);
        const response = await orderService.setOrderInfomatinByOrderId(
          orderId,
          toUpdateObj,
        );
        if (response.updateOrderInfo) {
          alert('수정이 완료되었습니다');
          location.href = '/pay-history';
        }
      }
    } else {
      alert('휴대전화번호 형식이 맞지 않습니다');
      document.querySelector('.receiver_phone').focus();
    }
  }
  btnActivityChanger();
};
const cancelBtnClickEventHandler = (orderId) => (e) => {
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

  deliveryDetail.addEventListener('click', (e) => {
    e.preventDefault();
    const addressSearchBtn = document.querySelector('.address_search');
    if (['배송 완료', '배송 중'].includes(order.status)) {
      addressSearchBtn.style.display = 'hidden';
      addressSearchBtn.disbled = true;
    } else if (e.target === addressSearchBtn) {
      new daum.Postcode({
        oncomplete: ({ zonecode, address }) => {
          addressLong.value = address;
          postalCode.value = zonecode;
          addressDetail.value = '';
          addressDetail.disabled = false;
          addressDetail.focus();
          addressDetail.placeholder = '상세 주소를 입력해주세요';
        },
      }).open();
    }
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

  cancelBtn.addEventListener('click', cancelBtnClickEventHandler(orderId));
};

document.addEventListener('DOMContentLoaded', init);
