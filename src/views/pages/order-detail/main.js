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

  const orderChangeBtn = document.querySelector('.order_change_btn');
  if (['배송 중', '배송완료'].includes(status)) {
    orderChangeBtn.disabled = true;
    orderChangeBtn.style.display = 'hidden';
    orderChangeBtn.innerText = '배송을 취소할 수 없습니다.';
  } else {
    orderChangeBtn.addEventListener('click', async (e) => {
      if (confirm('배송정보를 수정하시겠습니까?')) {
        location.href = `/order-change/${orderId}`;
      } else {
        return;
      }
    });
  }

  const orderCancelBtn = document.querySelector('.order_cancel_btn');
  if (['배송 중', '배송완료'].includes(status)) {
    orderCancelBtn.disabled = true;
    orderCancelBtn.style.display = 'hidden';
    orderCancelBtn.innerText = '배송을 취소할 수 없습니다.';
  } else {
    orderCancelBtn.addEventListener('click', async (e) => {
      if (confirm('배송을 취소하시겠습니까?')) {
        const response = await (
          await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          })
        ).json();
        if (response.acknowledged) {
          alert('주문이 취소되었습니다.');
          location.href = '/pay-history';
        }
      } else {
        return;
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
