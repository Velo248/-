import {
  getLocalStorageItem,
  setLocalStorageItem,
  parsePrice,
} from '/public/scripts/util.js';
import cartService from '/public/scripts/cartService.js';
import productService from '/public/scripts/productService.js';

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
  return;
};

// guset, user 공통 장바구니 RUD
//
const getLocalBasket = () => {
  return getLocalStorageItem('basket');
};
// 수량 변경 시 사용
const setLocalBasket = (item) => {
  const productId = item.dataset.productId;
  const quantity = Number(item.querySelector('.product_count').value);
  const localBasket = getLocalBasket();
  const updatedBasket = localBasket.map((basketItem) => {
    if (basketItem.productId === productId) {
      basketItem.quantity = quantity;
      return basketItem;
    } else {
      return basketItem;
    }
  });
  setLocalStorageItem('basket', updatedBasket);
  return;
};
// 물품 삭제 시 사용
const deleteLocalBasket = (item) => {
  const productId = item.dataset.productId;
  const localBasket = getLocalBasket();
  const updatedBasket = localBasket.filter(
    (localItem) => localItem.productId !== productId,
  );
  setLocalStorageItem('basket', updatedBasket);
  return;
};

// user only 장바구니 RUD -> usnig api
// user에 의한 접근 시 장바구니를 생성
const getUserCartItems = async () => {
  const { orderSheets } = await cartService.getCurrentUserCart();
  return orderSheets;
};
// 장바구니 수량 변경 시 사용
const patchUserCartItem = async (item) => {
  const productId = item.dataset.productId;
  const quantity = Number(item.querySelector('.product_count').value);
  const toUpdate = { productId, quantity };
  const response = await cartService.updateCartItem(toUpdate);
  setLocalBasket(item);
  return response;
};
// 물품 삭제 시 사용
const deleteUserCartItem = async (item) => {
  const productId = item.dataset.productId;
  const response = await cartService.deleteCartItem({ productId });
  return response;
};
// updateBasket -> loaclBasket과 db Basket을 합친 basket을 return
const updateBasket = async (localBasket) => {
  localBasket.forEach(async (item) => await cartService.updateCartItem(item));
  const basket = await getUserCartItems();
  return basket;
};

// guest, user 공통 주문목록 설정 -> payment page로 전달될 array
const setOrderList = () => {
  const selected = selectedItems();
  const orderItems = [];
  selected.forEach((item) => {
    const productId = item.dataset.productId;
    const quantity = Number(item.querySelector('.product_count').value);
    orderItems.push({ productId, quantity });
  });
  setLocalStorageItem('orderList', orderItems);
  return;
};
const getOrderList = () => {
  return getLocalStorageItem('orderList');
};

// 장바구니 item 정보를 이용하여 동적으로 생성한다
const createItemWrapper = ({ _id, title, price, imageKey }, count) => {
  const itemWrapper = document.createElement('div');
  itemWrapper.className = 'flex-justify-between product';
  itemWrapper.dataset.productId = _id;
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
  return itemWrapper;
};

const paintBasketItem = async ({ productId, quantity }) => {
  const basketItemList = document.querySelector('.basket_item_list');
  const basketItem = await productService.getProductByProductId(productId);
  const itemWrapper = createItemWrapper(basketItem, quantity);
  basketItemList.appendChild(itemWrapper);
  return;
};

// eventHandlers 분리
const basketClickEventHandler = async (e) => {
  if (e.target.id === 'basketChkAll') {
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    checkBoxes.forEach((checkBox) => (checkBox.checked = e.target.checked));
    setOrderList();
  }
  if (e.target.classList.contains('remove_all_items')) {
    const items = document.querySelectorAll('.product');
    [...items]?.forEach(async (item) => {
      if (sessionStorage.getItem('token')) {
        await deleteUserCartItem(item);
      }
      item.remove();
    });
    localStorage.removeItem('basket');
    localStorage.removeItem('orderList');
  }
  if (e.target.classList.contains('remove_selected_item')) {
    const selected = selectedItems();
    selected.forEach(async (item) => {
      if (sessionStorage.getItem('token')) {
        await deleteUserCartItem(item);
      }
      deleteLocalBasket(item);
      item.remove();
    });
  }
  if (e.target.classList.contains('payment')) {
    if (!sessionStorage.getItem('token')) {
      alert('로그인이 필요합니다');
      location.href = '/login';
    } else {
      const orderList = getOrderList();
      if (orderList.length < 1) {
        alert('선택된 상품이 없습니다');
      } else {
        setOrderList();
        if (confirm('결제를 진행하시겠습니까?')) {
          location.href = '/payments';
        }
      }
    }
  }
  printTotalPrice();
};

const basketChangeEventHandler = async (e) => {
  if (e.target.classList.contains('product_count')) {
    const item = e.target.parentNode.parentNode;
    if (sessionStorage.getItem('token')) {
      await patchUserCartItem(item);
    }
    setLocalBasket(item);
  }
  setOrderList();
  printTotalPrice();
};

// 페이지 로딩 시 실행될 init function
const init = async () => {
  const loginToken = sessionStorage.getItem('token') ?? null;

  let localBasket = getLocalBasket() ?? [];

  const basket = document.querySelector('.basket');
  const basketItemList = document.querySelector('.basket_item_list');
  basketItemList.innerHTML = `
    <div class="flex-justify-between">장바구니에 상품이 없습니다</div>
  `;

  localBasket = localBasket.map((item) => {
    if (item.itemId) {
      return { productId: item.itemId, quantity: item.count };
    }
    return item;
  });

  setLocalStorageItem('basket', localBasket);
  let basketItems = localBasket;
  basketItemList.innerHTML = '';

  if (loginToken) {
    basketItems = await updateBasket(localBasket);
    basketItemList.innerHTML = '';
    basketItems.forEach(paintBasketItem);
  } else {
    basketItems?.forEach(paintBasketItem);
  }

  // 클릭 이벤트 - checkbox 개별/전체 선택/해제 // 삭제
  basket.addEventListener('click', basketClickEventHandler);

  // change 이벤트 - 수량 등
  basket.addEventListener('change', basketChangeEventHandler);
};

document.addEventListener('DOMContentLoaded', init);
