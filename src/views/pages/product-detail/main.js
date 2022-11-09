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

  // 수량란이 사용하기 어려워서 증가 삭제 버튼 추가 예정
  let data = productsList;
  products = `<div class="detail-producer">${data.manufacturer}</div>
  <h3 class="detail-title">${data.title}</h3>

  <p class="detail-producer">${data.detailDescription}</p>
  <div class="detail-price">${data.price} 원</div>
  <div>
    <label class="blind" for="count">수량</label>
    <input id="count" class="detail-count" type="number" value="1" min="1" />
  </div>
  <div class="button_wrap">
    <button class="bg-pink btn-m-box" onclick="getBasket('${data._id}')">장바구니 담기</button>
  </div>`;

  $productDetail.innerHTML = `${products}`;
};

const getBasket = (itemId) => {
  let count = parseInt(document.querySelector('.detail-count').value);
  let items = JSON.parse(localStorage.getItem('basket'))
    ? JSON.parse(localStorage.getItem('basket'))
    : [];

  if (items.length !== 0) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].itemId == itemId && items[i].count == count) {
        break;
      } else if (items[i].itemId == itemId) {
        items[i].count = count;
        break;
      } else if (items[i].itemId !== itemId && i == items.length - 1) {
        items.push({ itemId, count });
        break;
      }
    }

    localStorage.setItem('basket', JSON.stringify(items));

    alert('상품을 장바구니에 담았습니다');
    if (confirm('장바구니로 이동하시겠습니까?')) {
      location.href = '/basket';
    }
  } else {
    let items = [{ itemId, count }];
    localStorage.setItem('basket', JSON.stringify(items));

    alert('상품을 장바구니에 담았습니다');

    if (confirm('장바구니로 이동하시겠습니까?')) {
      location.href = '/basket';
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // /* ----- ALL 탭에서 모든 제품 가져오기 ----- */
  await getAllItems();
});
