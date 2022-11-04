/**
 * 장바구니 스토리지에 어떻게 담을지 상의
 * 회원->DB에, 비회원은 세션 or 로컬 스토리지에
 */
const getAPI = async (url) => {
  return (await fetch(`${url}`)).json();
};

const getAllItems = async () => {
  let $productDetail = document.querySelector('.product-detail');
  let productsList = [];
  let idKey = window.location.href.split('/').slice(-2, -1);
  let products = '';

  try {
    productsList = await getAPI(`/api/products/${idKey}`);
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }

  let data = productsList;
  products = `<div>
    <span>카테고리</span>
    <span>${data.title}</span>
  </div>
  <div>
    <span>제품명</span>
    <span class="detail-title">${data.title}</span>
  </div>
  <div>
    <span>제조사</span>
    <span class="detail-producer">${data.manufacturer}</span>
  </div>
  <div>
    <span>상세설명</span>
    <span class="detail-producer">${data.detailDescription}</span>
  </div>
  <div>
    <span>가격</span>
    <span class="detail-price">${data.price}</span>
  </div>
  <div>
    <label for="count">수량</label>
    <input id="count" class="detail-count" type="number" value="1" />
  </div>
  <div class="button_wrap">
    <button onclick="getItem('${data._id}')">장바구니 담기</button>
  </div>`;

  $productDetail.innerHTML = `${products}`;
};

const getItem = (_id) => {
  let count = document.querySelector('.detail-count').value;

  if (sessionStorage.getItem('basket')) {
    let items = [];
    items = JSON.parse(sessionStorage.getItem('basket'));

    items.push({ _id, count });

    // 중복 제거 함수, 수량 업데이트는 아직 X
    const newArray = items.reduce(function (acc, current) {
      if (acc.findIndex(({ _id }) => _id === current._id) === -1) {
        acc.push(current);
      }
      return acc;
    }, []);
    sessionStorage.setItem('basket', JSON.stringify(newArray));

    alert('상품을 장바구니에 담았습니다');
    let moveBasket = confirm('장바구니로 이동하시겠습니까?');
    if (moveBasket) location.href = '/basket';
  } else {
    let items = [{ _id, count }];
    sessionStorage.setItem('basket', JSON.stringify(items));
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // /* ----- ALL 탭에서 모든 제품 가져오기 ----- */
  await getAllItems();
});
