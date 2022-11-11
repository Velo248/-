const getAPI = async (url) => {
  return (await fetch(`${url}`)).json();
};

const getAllItems = async () => {
  const $breadcrumb = document.querySelector('.product_breadcrumb');
  const $productDetail = document.querySelector('.product_wrap');
  let productsList = [];
  const idKey = window.location.href.split('/').slice(-2, -1);
  let breadcrumb = '';
  let products = '';

  try {
    productsList = await getAPI(`/api/products/${idKey}`);
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }

  const { imageKey, title, manufacturer, detailDescription, price, _id } =
    productsList;

  breadcrumb = `
    <a href="/">Main</a>
    &gt;
    <a href="/product">제품</a>
    &gt;
    <a href="#">${title}</a>
    `;

  products = ` <div class="img_wrap">
  <img src="/public/images/${imageKey}.jpg" alt="${title}" />
</div>
<div class="product_detail">
  <div class="detail-producer">${manufacturer}</div>
  <h3 class="detail-title">${title}</h3>

  <p class="detail-producer">${detailDescription}</p>
  <div class="detail-price">${price.toLocaleString('ko-KR')} 원</div>
  <div>
    <label class="blind" for="quantity">수량</label>
    <input id="quantity" class="detail-quantity" type="number" value="1" min="1" />
  </div>
  <div class="button_wrap">
    <button class="bg-pink btn-m-box">장바구니 담기</button>
  </div>
</div>`;

  $productDetail.innerHTML = `${products}`;
  $breadcrumb.innerHTML = `${breadcrumb}`;

  $productDetail.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-m-box')) {
      getBasket(_id);
    }
  });
};

const getBasket = (productId) => {
  const quantity = parseInt(document.querySelector('.detail-quantity').value);
  const items = JSON.parse(localStorage.getItem('basket'))
    ? JSON.parse(localStorage.getItem('basket'))
    : [];

  if (items.length !== 0) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].productId == productId && items[i].quantity == quantity) {
        break;
      } else if (items[i].productId == productId) {
        items[i].quantity = quantity;
        break;
      } else if (items[i].productId !== productId && i == items.length - 1) {
        items.push({ productId, quantity });
        break;
      }
    }

    localStorage.setItem('basket', JSON.stringify(items));

    alert('상품을 장바구니에 담았습니다');
    if (confirm('장바구니로 이동하시겠습니까?')) {
      location.href = '/basket';
    }
  } else {
    const items = [{ productId, quantity }];
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
