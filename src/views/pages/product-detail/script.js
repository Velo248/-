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
  let idKey = window.location.href.split('/').pop();
  let products = '';
  try {
    productsList = await getAPI(`/api/products/${idKey}`);
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }

  let data = productsList[0];
  products = `<div>
  <span>카테고리</span>
  <span>${idKey}</span>
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
  <button onclick="getItem('${idKey}')">장바구니 담기</button>
</div>`;

  $productDetail.innerHTML = `${products}`;
};

const getItem = (idKey) => {
  let count = document.querySelector('.detail-count').value;
  // * 장바구니 세션에 임시로 저장,
  // * 장바구니 스토리지 어디에 어떤 형태로 담을지 상의
  sessionStorage.setItem('basket', JSON.stringify({ idKey, count }));
  alert('상품을 장바구니에 담았습니다');
  let moveBasket = confirm('장바구니로 이동하시겠습니까?');
  if (moveBasket) location.href = '/basket';
};

document.addEventListener('DOMContentLoaded', async () => {
  // /* ----- ALL 탭에서 모든 제품 가져오기 ----- */
  await getAllItems();
});
