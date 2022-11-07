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
    <input id="count" class="detail-count" type="number" value="1" min="1" />
  </div>
  <div class="button_wrap">
    <button onclick="getItem('${data._id}')">장바구니 담기</button>
  </div>`;

  $productDetail.innerHTML = `${products}`;
};

const getItem = (itemId) => {
  let count = parseInt(document.querySelector('.detail-count').value);
  let items = [];

  if (localStorage.getItem('basket')) {
    items = JSON.parse(localStorage.getItem('basket'));

    for (let i = 0; i < items.length; i++) {
      // items.length 이게 문제인거 같다!
      if (items[i].itemId == itemId && items[i].count == count) {
        break;
      } else if (items[i].itemId == itemId) {
        items[i].count = count;
        break;
      } else if (items[i].itemId !== itemId) {
        console.log(itemId, items[i].itemId);
        items.push({ itemId, count });
        break;
      }
      console.log(items[i]);
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
