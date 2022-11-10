import {
  getLocalStorageItem,
  setLocalStorageItem,
  parsePrice,
} from '/public/scripts/util.js';
import basketService from '/public/scripts/basketService.js';
import productService from '/public/scripts/productService.js';

const selectedItems = () => {
  const items = document.querySelectorAll('.product');
  const selectedItems = [...items].filter(
    (item) => item.querySelector('input[type="checkbox"]').checked,
  );
  return selectedItems;
};

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

const getLocalBasket = () => {
  return getLocalStorageItem('basket');
};

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
const getUserBaskets = async () => {
  const { baskets } = await basketService.getCurrentUserBaskets();
  return baskets;
};
const upToDateUserBasksets = async (localBasket) => {
  await basketService.updateBasketItem(localBasket);
};
const deleteLocalBasket = (item) => {
  const productId = item.dataset.productId;
  const localBasket = getLocalBasket();
  const updatedBasket = localBasket.filter(
    (localItem) => localItem.productId !== productId,
  );
  setLocalStorageItem('basket', updatedBasket);
  return;
};

const updateUserBasketItem = async (item) => {
  const productId = item.dataset.productId;
  const quantity = Number(item.querySelector('.product_count').value);
  const toUpdateObj = { productId, quantity };
  const response = await basketService.updateBasketItem([toUpdateObj]);
  setLocalBasket(item);
  return response;
};

const deleteUserBasketItem = async (item) => {
  const basketId = item.dataset.basketId;
  const response = await basketService.deleteBasketItem(basketId);
  return response;
};

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

const createItemWrapper = (
  basketId,
  { _id: productId, title, price, imageKey },
  count,
) => {
  const itemWrapper = document.createElement('div');
  itemWrapper.className = 'flex-justify-between product';
  itemWrapper.dataset.basketId = basketId;
  itemWrapper.dataset.productId = productId;
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

const paintBasketItem = async ({ _id: basketId = '', productId, quantity }) => {
  const basketItemList = document.querySelector('.basket_item_list');
  const basketItem = await productService.getProductByProductId(productId);
  const itemWrapper = createItemWrapper(basketId, basketItem, quantity);
  basketItemList.appendChild(itemWrapper);
  return;
};

const basketClickEventHandler = async (e) => {
  if (e.target.id === 'basketChkAll') {
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    checkBoxes.forEach((checkBox) => (checkBox.checked = e.target.checked));
    setOrderList();
  }
  if (e.target.classList.contains('remove_all_items')) {
    if (confirm('모두 삭제하시겠습니까?')) {
      if (sessionStorage.getItem('token')) {
        basketService.deleteUserBaskets();
      }
      localStorage.removeItem('basket');
      localStorage.removeItem('orderList');
      const items = document.querySelectorAll('.product');
      items.forEach((item) => item.remove());
    }
  }
  if (e.target.classList.contains('remove_selected_item')) {
    if (confirm('선택 항목을 삭제하시겠습니까?')) {
      const selected = selectedItems();
      selected.forEach(async (item) => {
        if (sessionStorage.getItem('token')) {
          await deleteUserBasketItem(item);
        }
        deleteLocalBasket(item);
        item.remove();
      });
    }
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
  setOrderList();
  printTotalPrice();
};

const basketChangeEventHandler = async (e) => {
  if (e.target.classList.contains('product_count')) {
    const item = e.target.parentNode.parentNode;
    if (sessionStorage.getItem('token')) {
      await updateUserBasketItem(item);
    }
    setLocalBasket(item);
  }
  setOrderList();
  printTotalPrice();
};
const basketLoader = () => {
  return `<div class="flex-jusitfy-between basket_loader">장바구니를 불러오고 있습니다</div>`;
};
const init = async () => {
  const loginToken = sessionStorage.getItem('token') ?? null;

  const localBasket = getLocalBasket() ?? [];
  let basketItems = [];

  const basket = document.querySelector('.basket');
  const basketItemList = document.querySelector('.basket_item_list');
  basketItemList.innerHTML = `
    <div class="flex-justify-between">장바구니에 상품이 없습니다</div>
  `;

  basketItems = localBasket;
  if (loginToken) {
    await upToDateUserBasksets(localBasket);
    basketItems = await getUserBaskets();
  }
  basketItemList.innerHTML = basketLoader();
  setTimeout(() => {
    basketItems?.forEach(paintBasketItem);
    document.querySelector('.basket_loader').remove();
  }, 1000);

  basket.addEventListener('click', basketClickEventHandler);
  basket.addEventListener('change', basketChangeEventHandler);
};

document.addEventListener('DOMContentLoaded', init);
