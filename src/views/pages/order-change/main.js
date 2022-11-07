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

const getOrder = async (orderId) => {
  const { order } = await (
    await fetch(`/api/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  ).json();
  return order;
};

const init = async () => {
  const orderId = location.pathname.split('/')[2];

  const { address, summaryTitle, totalPrice, request, status } = await getOrder(
    orderId,
  );
  const orderWrapper = document.querySelector('.order_wrapper');
  const deliveryDetail = document.querySelector('.delivery_detail');
  orderWrapper.appendChild(
    createOrderRow({ summaryTitle, totalPrice, status }),
  );
  deliveryDetail.appendChild(createDeliveryInfo({ address, status }));

  const addressLong = document.querySelector('.receiver_address_long');
  const addressDetail = document.querySelector('.receiver_address_detail');
  const postalCode = document.querySelector('.receiver_postal_code');
  const receiverName = document.querySelector('.receiver_name');
  const receiverPhone = document.querySelector('.receiver_phone');

  addressLong.value = address.address1;
  addressDetail.value = address.address2;
  postalCode.value = address.postalCode;
  receiverName = address.receiverName;
  receiverPhone = address.receiverPhoneNumber;

  const addressSearchBtn = document.querySelector('.address_search');
  addressSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: ({ zonecode, address }) => {
        addressLong.innerText = address;
        postalCode.innerText = zonecode;
        addressDetail.disabled = false;
        addressDetail.focus();
        addressDetail.placeholder = '상세 주소를 입력해주세요';
      },
    }).open();
  });

  const doneBtn = document.querySelector('.done_btn');
  const cancelBtn = document.querySelector('.cancel_btn');

  doneBtn.addEventListener('click', async (e) => {
    doneBtn.disabled = true;
    cancelBtn.disabled = true;
    const toUpdateObj = {
      address: {
        address1: addressLong.value,
        address2: addressDetail.value,
        postalCode: postalCode.value,
        receiverName: receiverName.value,
        receiverPhoneNumber: receiverPhone.value,
      },
    };
    if (!addressLong.value || !receiverName.value || !receiverPhone.value) {
      alert('배송지 정보를 모두 입력해주세요.');
    } else {
      if (confirm('배송정보를 수정하시겠습니까?')) {
        const response = await (
          await fetch(`/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(toUpdateObj),
          })
        ).json();
        if (response.ok) {
          alert('수정이 완료되었습니다');
          location.href = '/pay-history';
        }
      } else {
        doneBtn.disabled = false;
        cancelBtn.disabled = false;
      }
    }
  });

  cancelBtn.addEventListener('click', (e) => {
    doneBtn.disabled = true;
    cancelBtn.disalbed = true;
    if (confirm('수정을 취소하시겠습니까?')) {
      location.href = `/orders/${orderId}`;
    } else {
      doneBtn.disabled = false;
      cancelBtn.disabled = false;
    }
  });
};

document.addEventListener('DOMContentLoaded', init);
