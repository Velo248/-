const $product_detail_wapper = document.querySelector('.product_detail_wapper');
const $product = document.querySelector('.product');

const getProduct = async () => {
  const response = await fetch(
    `/api/products/${sessionStorage.getItem('p_id')}`,
  );
  return await response.json();
};

const getCategory = async () => {
  const respose = await fetch('/api/categories');
  return await respose.json();
};

const elementCreater = (current, add) => {
  current.innerHTML += add;
};

const dateFormet = (date) => {
  return `${date.substring(0, 10)} ${date.substring(11, 16)}`;
};

const getCategoryTitleFromId = (product, category) => {
  let categoryObj = {};
  const tempProduct = { ...product };

  category.forEach((categorise) => {
    const { _id, title } = categorise;
    categoryObj[_id] = title;
  });

  tempProduct.categoryTitle = categoryObj[tempProduct.categoryId];

  return tempProduct;
};

const pageRender = async () => {
  const productResponse = await getProduct();
  const categoryResponse = await getCategory();

  const product = getCategoryTitleFromId(productResponse, categoryResponse);

  const {
    _id,
    sellerId,
    title,
    categoryTitle,
    categoryId,
    manufacturer,
    shortDescription,
    detailDescription,
    imageKey,
    inventory,
    price,
    searchKeywords,
    isRecommended,
    discountPercent,
    createdAt,
    updatedAt,
  } = product;

  const createDate = dateFormet(createdAt);
  const updateDate = dateFormet(updatedAt);

  const temp_html = `
    <form class='edit_form' id=${_id}>
      <div>
        <input name='title' value="${title}">
      </div>
      <div>
        <input name='sellerId' value="${sellerId}">
      </div>
      <div>
        <input name='categoryTitle' value="${categoryTitle}" readonly>
      </div>
      <div>
        <input name='manufacturer' value="${manufacturer}">
      </div>
      <div>
        <input name='shortDescription' value="${shortDescription}">
      </div>
      <div>
        <input name='detailDescription' value="${detailDescription}">
      </div>
      <div>
        <input name='imageKey' value="${imageKey}">
      </div>
      <div>
        <input name='inventory' value="${inventory}">
      </div>
      <div>
        <input name='price' value="${price}">
      </div>
      <div>
        <input name='searchKeywords' value="${searchKeywords}">
      </div>
      <div>
        <input name='isRecommended' value="${isRecommended}">
      </div>
      <div>
        <input name='discountPercent' value="${discountPercent}">
      </div>
      <div>
        <span>${createDate}</span>
      </div>
      <div>
        <span>${updateDate}</span>
      </div>
    </form>
  `;

  elementCreater($product, temp_html);
};

const deleteProduct = async () => {
  const data = {
    target: sessionStorage.getItem('p_id'),
    dataObj: {},
    method: 'DELETE',
  };
  if (confirm('진심 삭제함?')) return await customFetcher(data);
  return;
};

const editProduct = async () => {
  const $edit_form = document.querySelector('.edit_form');
  const formData = new FormData($edit_form);

  //카테고리ID <-> 카테고리title 매칭추가 예정
  const updateObj = {};
  updateObj.title = formData.get('title');
  updateObj.sellerId = formData.get('sellerId');
  updateObj.manufacturer = formData.get('manufacturer');
  updateObj.shortDescription = formData.get('shortDescription');
  updateObj.detailDescription = formData.get('detailDescription');
  updateObj.imageKey = formData.get('imageKey');
  updateObj.inventory = formData.get('inventory');
  updateObj.price = formData.get('price');
  updateObj.searchKeywords = formData.get('searchKeywords');
  updateObj.isRecommended = formData.get('isRecommended');
  updateObj.discountPercent = formData.get('discountPercent');

  const data = {
    target: $edit_form.getAttribute('id'),
    dataObj: updateObj,
    method: 'PATCH',
  };

  await customFetcher(data);
  sessionStorage.removeItem('p_id');
  window.location.href = '/admin-product-list';
};

const clickEventMap = {
  product_delete_bnt() {
    deleteProduct();
  },

  product_edit_bnt() {
    editProduct();
  },
};

$product_detail_wapper.addEventListener('click', (e) => {
  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});

//리팩토링때, 분리예정
const customFetcher = async (data) => {
  const { target, dataObj, method } = data;

  const res = await fetch(`/api/products/${target}`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(dataObj),
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }

  sessionStorage.removeItem('p_id');
  window.location.href = '/admin-product-list';
};
