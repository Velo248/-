// 주문상세 페이지

// 전체 주문을 받아오는 방식
const getOrder = async (orderId = '6363577d9947d72e5d55aff3') => {
  // with token
  const { token } = await testLogin();
  const response = await (
    await fetch(`/api/orders/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  ).json();
  return response;
};

const paintOrder = ({
  summaryTitle,
  totalPrice,
  address: {
    address1,
    address2,
    postalCode,
    receiverName,
    receiverPhoneNumber,
  },
  request,
  status,
}) => {
  const orderId = location.pathname.split('/')[2];

  const orderNumberDetail = document.querySelector('.order_number');
  orderNumberDetail.innerText = orderId;

  const orderInfoWrapper = document.querySelector('.order_wrapper');
  const productImg = orderInfoWrapper.querySelector('.product_img');
  const productName = orderInfoWrapper.querySelector('.product_name');
  const productPrice = orderInfoWrapper.querySelector('.product_price');
  const productCount = orderInfoWrapper.querySelector('.product_count');
  const productTotalPrice = orderInfoWrapper.querySelector('.total_price');

  productImg.src = '';
  productName.innerText = summaryTitle;
  productPrice.innerText = totalPrice.toLocaleString('ko-kr');
  productCount.innerText = 1;
  productTotalPrice.innerText = totalPrice.toLocaleString('ko-kr');
};

const orderDetailPage = async () => {
  const order = await getOrder();
  paintOrder(order);
};

const init = () => {
  orderDetailPage();
};

document.addEventListener('DOMContentLoaded', init);
