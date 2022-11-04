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
const templateHistory = ({ _id, summaryTitle, totalPrice, status }) => {
  const historyDetail = document.createElement('div');
  historyDetail.className = 'flex-justify-between payment_history_detail';
  historyDetail.dataset.id = _id;
  const historyBody = `
    <div class="order_number">
    <a href="/orders/${_id}">${_id}</a></div>
    <div class="order_title">${summaryTitle}</div>
    <div class="order_status">${status}</div>
    <div class="order_total_price">${totalPrice.toLocaleString('ko-kr')}원</div>
    `;
  historyDetail.innerHTML = historyBody;

  return historyDetail;
};

const init = async () => {
  const token = (await testLogin()) || sessionStorage.getItem('token');

  const paymentHistoryBody = document.querySelector('.payment_history_body');

  // api 수정 후 URL 변경 필수
  const orders = await (
    await fetch('/api/orderlist/user', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  ).json();
  paymentHistoryBody.innerHTML = '';
  orders.forEach((order) => {
    paymentHistoryBody.appendChild(templateHistory(order));
  });
};

init();
