const getLocalStroageItem = (itemKey) => {
  return JSON.parse(localStorage.getItem(itemKey));
};

const setLocalStorageItem = (itemKey, data) => {
  localStorage.setItem(itemKey, JSON.stringify(data));
  return;
};

// localeString을 Number로 변경
const parsePrice = (str) => parseInt(str.replace(/,/g, ''), 10);

// 전체 아이템 중 선택된 아이템만을 반환
const selectedItems = () => {
  const items = document.querySelectorAll('.product');
  const selectedItems = [...items].filter(
    (item) => item.querySelector('input[type="checkbox"]').checked,
  );
  return selectedItems;
};

// 변화 이벤트마다 실행하여 현재 선택된 품목에 의한 총 가격을 계산
const printTotalPrice = () => {
  const productTotalPrice = document.querySelector('.product_total_price');
  const selected = selectedItems();
  const selectedPrice = selected.reduce((prev, curItem) => {
    const price = parsePrice(
      curItem.querySelector('.product_price').textContent,
    );
    const count = Number(curItem.querySelector('.product_count').value);
    return (prev += price * count);
  }, 0);
  productTotalPrice.innerText = selectedPrice.toLocaleString('ko-kr');
};

// guset, user 공통 장바구니 RUD
//
const getLocalBasket = () => {
  return getLocalStroageItem('basket');
};
// 수량 변경 시 사용
const setLocalBasket = (item) => {
  const productId = item.dataset.product_id;
  const quantity = Number(item.querySelector('.product_count').value);
  const localBasket = getLocalBasket();
  const updatedBasket = localBasket.map((basketItem) => {
    if (basketItem._id === productId) {
      basketItem.quantity = quantity;
    }
  });
  setLocalStorageItem('basket', updatedBasket);
};
// 물품 삭제 시 사용
const deleteLocalBasket = (item) => {
  const productId = item.datset.product_id;
  const localBasket = getLocalBasket();
  const updatedBasket = localBasket.filter(({ _id }) => _id !== productId);
  setLocalStorageItem('basket', updatedBasket);
  return;
};

// user only 장바구니 RUD -> usnig api
// user에 의한 접근 시 장바구니를 생성
const getUserCartItems = async () => {};
// 장바구니 수량 변경 시 사용
const patchUserCartItem = async (item) => {
  const productId = item.dataset.product_id;
  const quantity = Number(item.querySelector('.product_count').value);
  const toUpdate = { productId, quantity };
  const response = await (
    await fetch(`/api/cart`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(toUpdate),
    })
  ).json();
  return;
};
// 물품 삭제 시 사용
const deleteUserCartItem = async (item) => {
  const productId = item.dataset.product_id;
  const response = await (
    await fetch(`/api/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({ productId }),
    })
  ).json();
  return;
};

// guest, user 공통 주문목록 설정 -> payment page로 전달될 array
const setOrderList = (orderItems) => {
  setLocalStorageItem('orderList', orderItems);
  return;
};
const getOrderList = () => {
  return getLocalStroageItem('orderList');
};

// 장바구니 item 정보를 이용하여 동적으로 생성한다
const createItemWrapper = ({ _id, quantity, title, price, imageKey }) => {
  const itemWrapper = document.createElement('div');
  itemWrapper.className = 'flex-justify-between product';
  itemWrapper.dataset.product_id = basketItem._id;
  itemWrapper.innerHTML = `
        <input type="checkbox" />
        <div class="img_wrap">
            <img src="${imageKey}" class="product_img" alt="${title}" />
        </div>
        <div class="product_name">${title}</div>
        <div class="product_price">${price.toLocaleString('ko-kr')}</div>
        <div>
        <input type="number" class="product_count" value="${Number(
          quantity,
        )}" min="0" />
        </div>
  `;
  return itemWrapper;
};
// guest라면 basketItem이 _id와 수량만을 가짐 {_id, quantity}
const paintGuestBasketItem = async ({ _id }) => {
  const basketItemList = document.querySelector('.basket_item_list');
  const basketItem = await (await fetch(`/api/products/${_id}`)).json();
  const itemWrapper = createItemWrapper(basketItem);
  basketItemList.appendChild(itemWrapper);
  return;
};

// user라면 basketItem이 모든 정보를 가짐 { _id, imageKey, title, price, quantity }
const paintUserBasketItem = (basketItem) => {
  const basketItemList = document.querySelector('.basket_item_list');
  const itemWrapper = createItemWrapper(basketItem);
  basketItemList.appendChild(itemWrapper);
  return;
};

// 페이지 로딩 시 실행될 init function
const init = async () => {
  const loginToken = sessionStorage.getItem('token') ?? null;

  let basketItems = [];

  if (!loginToken) {
    basketItems = getLocalBasket();
    basketItems?.forEach(paintGuestBasketItem);
  } else {
    basketItems = await getUserCartItems();
    basketItems?.forEach(paintUserBasketItem);
  }

  const basket = document.querySelector('.basket');
  const basketItemList = document.querySelector('.basket_item_list');
  const basketChkAllBtn = document.querySelector('#basketChkAll');
  const removeSelectedItemBtn = document.querySelector('.remove_selected_item');
  const paymentBtn = document.querySelector('.payment');

  // 클릭 이벤트 - checkbox 개별/전체 선택/해제 // 삭제
  basket.addEventListener('click', (e) => {
    if (e.target === basketChkAllBtn) {
      const checkBoxes = basketItemList.querySelectorAll(
        "input[type='checkbox']",
      );
      checkBoxes.forEach((Node) => (Node.checked = basketChkAllBtn.checked));
      setOrderList();
    }
    if (e.target === removeSelectedItemBtn) {
      const selected = selectedItems();
      selected.forEach(async (item) => {
        if (loginToken) {
          await deleteUserCartItem(item);
        } else {
          deleteLocalBasket(item);
        }
        item.remove();
      });
    }
    if (e.target === paymentBtn) {
      if (!loginToken) {
        alert('로그인이 필요합니다.');
        location.reload();
      } else {
        const orderList = getOrderList();
        if (orderList.length < 1) {
          alert('선택된 상품이 없습니다');
        } else {
          if (confirm('결제를 진행하시겠습니까?')) {
            location.href = '/payments';
          }
        }
      }
    }
    // 이벤트에 대해 선택된 물건의 수량을 기준으로 총 금액을 설정한다.
    printTotalPrice();
  });

  // change 이벤트 - 수량 등
  basket.addEventListener('change', async (e) => {
    if (e.target.type === 'input[type="number"]') {
      if (!loginToken) {
        setLocalBasket(item);
      } else {
        await patchUserCartItem(item);
      }
    }
    // 이벤트에 대해 선택된 물건의 수량을 기준으로 총 금액을 설정한다.
    setOrderList();
    printTotalPrice();
  });
};

document.addEventListener('DOMContentLoaded', init);
