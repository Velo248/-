/**
 * 상세 조회 api가 없는건지 확인하기
 */
const getAPI = async (url) => {
  return (await fetch(`${url}`)).json();
};

document.addEventListener('DOMContentLoaded', async () => {
  // /* ----- ALL 탭에서 모든 제품 가져오기 ----- */
  await getAllItems();
});

// 모든 아이템 가져오기
// 변형해서 임시로 사용
const getAllItems = async () => {
  let $productDetail = document.querySelector('.product-detail');
  let products = '';

  try {
    productsList = await getAPI('/api/productlist'); // 임시로 할거라 1개만
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }

  let data = productsList[0];
  console.log(productsList[0]);
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
  <button>장바구니 담기</button>
</div>`;

  $productDetail.insertAdjacentHTML('beforeend', products);
};
