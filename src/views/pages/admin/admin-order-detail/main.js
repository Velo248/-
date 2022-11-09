import { elementCreater, dateFormet } from '/public/scripts/util.js';
import adminService from '/public/scripts/adminService.js';
import orderService from '/public/scripts/orderService.js';

const $admin_order_detail_wapper = document.querySelector(
  '.admin_order_detail_wapper',
);
const $order_info = document.querySelector('.order_info');
const $order_edit = document.querySelector('.order_edit');

const deliveryMap = ['배송 준비', '배송 중', '배송 완료'];

const getOrder = async () => {
  const order = await orderService.getOrderByOrderId(
    sessionStorage.getItem('o_id'),
  );
  sessionStorage.removeItem('o_id');
  return order;
};

const setSelectOption = (target, selected) => {
  deliveryMap.forEach((status) => {
    if (status === selected) {
      const temp_html = `
      <option selected value="${status}">${status}</option>
    `;
      elementCreater(target, temp_html);
    } else {
      const temp_html = `
      <option value="${status}">${status}</option>
    `;
      elementCreater(target, temp_html);
    }
  });
};

const setDeliveryStatus = async () => {
  const $delivery_status = document.querySelector('.delivery_status');
  const deliveryId = document.querySelector('.delivery_id').innerText;
  const obj = {
    status: $delivery_status.value,
  };
  await adminService.setOrderInformationByOrderId(deliveryId, obj);
  location.href = '/admin/order/list';
};

const deleteOrder = async () => {
  if (confirm('진심 삭제함?')) {
    const deliveryId = document.querySelector('.delivery_id').innerText;
    await adminService.deleteOrderByOrderId(deliveryId);
    location.href = '/admin/order/list';
  }
};

const clickEventMap = {
  back_order_list_bnt: () => (location.href = '/admin/order/list'),
  edit: async () => await setDeliveryStatus(),
  cancel: async () => await deleteOrder(),
};

$admin_order_detail_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

const pageRender = async () => {
  const order = await getOrder();

  console.log(order.order);
  const {
    _id,
    request,
    status,
    summaryTitle,
    totalPrice,
    createdAt,
    updatedAt,
    userId,
    address,
  } = order.order;

  const { address1, address2, postalCode, receiverName, receiverPhoneNumber } =
    address;
  const createDate = dateFormet(createdAt);
  const updateDate = dateFormet(updatedAt);
  const temp_html = `
    <div class="detail_container">
      <div class="detail_name">
        <div>
          <span>주문번호</span>
        </div>
        <div>
          <span>주문시간</span>
        </div>
        <div>
          <span>수정시간</span>
        </div>
        <div>
          <span>제품명</span>
        </div>
        <div>
          <span>총액</span>
        </div>
      </div>
      <div class="detail_info">
        <div>
          <span class='delivery_id'>${_id}</span>
        </div>
        <div>
          <span>${createDate}</span>
        </div>
        <div>
          <span>${updateDate}</span>
        </div>
        <div>
          <span>${summaryTitle}</span>
        </div>
        <div>
          <span>${totalPrice}</span>
        </div>
      </div>
    </div>
  `;
  elementCreater($order_info, temp_html);

  const temp_html2 = `
    <div class='delivery_container'>
      <div class='delivery_name'>
        <div>
          <span>받으시는 분</span>
        </div>
        <div>
          <span>주소</span>
        </div>
        <div>
          <span>연락처</span>
        </div>
        <div>
          <span>요청사항</span>
        </div>
        <div>
          <span>현재 상태</span>
        </div>
        <div>
          <span>상태 수정</span>
        </div>
      </div>
      <div class='delivery_info'>
        <div>
          <span>${receiverName}</span>
        </div>
        <div class='address'>
          <div>
            <span>우편번호:  </span>
            <span>${postalCode}</span>
          </div>
          <div>
            <span>주소:  </span>
            <span>${address1} ${address2}</span>
          </div>
        </div>
        <div>
          <span>${receiverPhoneNumber}</span>
        </div>
        <div>
          <span>${request}</span>
        </div>
        <div>
          <span>${status}</span>
        </div>
        <div>
          <select class='delivery_status' name='delivery_status'></select>
        </div>
      </div>
    </div>
  `;

  elementCreater($order_edit, temp_html2);
  setSelectOption(document.querySelector('.delivery_status'), status);
};

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
