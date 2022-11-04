// guest와 user 차이
// guest는 localStorage에서 불러옴
// user는 localStorage와 DB를 합침?
// 이벤트: 전체선택버튼 / 전체선택 해제 시 전부 해제 / 전체선택 후 삭제 / 결제버튼 /

const getLocalStroageItem = (itemKey) => {
  return JSON.parse(localStorage.getItem(itemKey));
};

const paintBasket = (basketItemList, basketData) => {
  basketData?.forEach(async ({ _id, count }) => {
    const { imageKey, price, title } = await (
      await fetch(`/api/products/${_id}`)
    ).json();
    const itemWrapper = document.createElement('div');
    itemWrapper.className = 'flex-justify-between';
    itemWrapper.classList.add('product');
    itemWrapper.dataset.product_id = _id;
    itemWrapper.innerHTML = `
          <input type="checkbox" />
          <div class="img_wrap">
              <img src="${imageKey}" class="product_img" alt="${title}" />
          </div>
          <div class="product_name">${title}</div>
          <div class="product_price">${price.toLocaleString('ko-kr')}</div>
          <div>
            <input type="number" class="product_count" value="${Number(
              count,
            )}" min="0" />
          </div>
        `;
    basketItemList.appendChild(itemWrapper);
  });
};

const parsePrice = (str) => parseInt(str.replace(/,/g, ''), 10);

const init = async () => {
  const isLoggedIn = sessionStorage.getItem('token') ?? null;
  const basket = document.querySelector('.basket');
  const basketChkAllBtn = document.querySelector('#basketChkAll');
  const basketItemList = document.querySelector('.basket_item_list');
  const removeSelectedItemBtn = document.querySelector('.remove_selected_item');
  const productTotalPrice = basket.querySelector('.product_total_price');
  const paymentBtn = document.querySelector('.payment');

  // basketItemList를 비운다.
  // basketItemList.innerHTML = '';

  // guset basket
  const basketItems = getLocalStroageItem('basket');

  // loggedInUser basket
  // const basketItems = await (await fetch()).json();
  // 전체선택 선택/해제 박스 이벤트
  basket.addEventListener('click', (e) => {
    if (e.target === basketChkAllBtn) {
      const checkboxes = basketItemList.querySelectorAll(
        "input[type='checkbox']",
      );
      checkboxes.forEach((Node) => (Node.checked = basketChkAllBtn.checked));
    }
  });

  // select가 true일 시, 수량 변경 시 총 가격 변경 및 basket 데이터 내 수량 변경 이벤트
  basket.addEventListener('change', (e) => {
    if (e.target.className === 'product_count') {
      const items = basket.querySelectorAll('.product');
      let totalPrice = 0;
      items.forEach((item) => {
        if (item.querySelector('input[type="checkbox"]').checked) {
          const price = parsePrice(
            item.querySelector('.product_price').textContent,
          );
          const count = Number(item.querySelector('.product_count').value);
          // basketItems = basketItems.map((item) => {
          //   if (item._id === Node.dataset.product_id) {
          //     return { ...item, count };
          //   }
          //   return item;
          // });
          // localStorage.setItem('basket', JSON.stringify(basket));
          totalPrice += price * count;
        }
      });
      productTotalPrice.innerText = totalPrice.toLocaleString('ko-kr');
    }
    if (e.target.type === 'checkbox' && e.target.checked) {
      const item = e.target.parentNode;
      let totalPrice = parsePrice(productTotalPrice.innerText);
      const price = parsePrice(
        item.querySelector('.product_price').textContent,
      );
      const count = Number(item.querySelector('.product_count').value);
      totalPrice += price * count;
      productTotalPrice.innerText = totalPrice.toLocaleString('ko-kr');
    }
  });

  // 선택 삭제 버튼이벤트
  basket.addEventListener('click', (e) => {
    if (e.target === removeSelectedItemBtn) {
      const items = basket.querySelectorAll('.product');
      const selectedItems = [...items].filter(
        (item) => item.querySelector('input[type="checkbox"]').checked,
      );
      selectedItems.forEach((item) => {
        const price = parsePrice(
          item.querySelector('.product_price').textContent,
        );
        const count = Number(item.querySelector('.product_count').value);
        const totalPrice = parsePrice(productTotalPrice.textContent);
        productTotalPrice.innerText = totalPrice - price * count;
        // basketItems = basketItems.filter(({_id}) => _id !== item.datset.product_id);
        // localStorage.setItem('basket', JSON.stringify(basketItems));
        item.remove();
      });
    }
  });

  // 결제 버튼 클릭 이벤트
  paymentBtn.addEventListener('click', () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      if (confirm('로그인 하시겠습니까?')) {
        location.href = '/login';
      }
    } else {
      const items = basket.querySelectorAll('.product');
      const selectedItems = [...items].filter(
        (item) => item.querySelector('input[type="checkbox"]').checked,
      );
      const selectedCounts = selectedItems.reduce(
        (prev, cur) => prev + Number(cur.querySelector('.product_count').value),
        0,
      );
      console.log(selectedCounts);
      if (selectedItems.length < 1 || selectedCounts === 0) {
        alert('선택된 상품이 없습니다.');
      } else {
        if (confirm('결제를 진행하시겠습니까?')) {
          // 선택된 아이템, 수량만을 DB에 전송한다?
          // 결제할 아이템
          const orderList = JSON.parse(localStorage.getItem('orderList')) ?? [];
          selectedItems.forEach((item) => {
            const itemId = item.dataset.product_id;
            const itemCount = item.querySelector('.product_count').value;
            // 결제로 진행할 orderList는 localStorage에 저장한다
            // 이미 존재하는 orderList가 있다면 내용을 변경한다
            orderList = [...orderList, { itemId, itemCount }];
          });
          localStorage.setItem('orderList', orderList);
        }
      }
    }
  });

  paintBasket(basketItemList, basketItems);
};

document.addEventListener('DOMContentLoaded', init);
