import { elementCreater, dateFormet } from '/public/scripts/util.js';
import productService from '/public/scripts/productService.js';
import categoryService from '/public/scripts/categoryService.js';
import adminService from '/public/scripts/adminService.js';

const $product_detail_wapper = document.querySelector('.product_detail_wapper');
const $product = document.querySelector('.product');

const categoryObj = {};

const setCategoryObj = (product, category) => {
  const tempProduct = { ...product };

  category.forEach((categorise) => {
    const { _id, title } = categorise;
    categoryObj[_id] = title;
  });

  tempProduct.categoryTitle = categoryObj[tempProduct.categoryId];

  return tempProduct;
};

const setSelectOption = (target, selected) => {
  Object.keys(categoryObj).forEach((category) => {
    if (category === selected) {
      const temp_html = `
      <option selected value="${categoryObj[category]}">${categoryObj[category]}</option>
    `;
      elementCreater(target, temp_html);
    } else {
      const temp_html = `
      <option value="${categoryObj[category]}">${categoryObj[category]}</option>
    `;
      elementCreater(target, temp_html);
    }
  });
};

const deleteProduct = async () => {
  if (confirm('진심 삭제함?')) {
    await adminService.deleteProductByProductId(sessionStorage.getItem('p_id'));
    location.href = '/admin/product/list';
  }
};

const productNameMatch = (productName) => {
  return Object.keys(categoryObj).find(
    (key) => categoryObj[key] === productName,
  );
};

const editProduct = async () => {
  const $edit_form = document.querySelector('.edit_form');
  const formData = new FormData($edit_form);
  const productId = $edit_form.getAttribute('id');

  const updateObj = {};

  for (const key of formData.keys()) {
    updateObj[key] = formData.get(key);
  }
  updateObj.categoryId = productNameMatch(updateObj.category_select);
  delete updateObj.category_select;

  await adminService.setProductInformationByProductId(productId, updateObj);
  sessionStorage.removeItem('p_id');
  location.href = '/admin/product/list';
};

const clickEventMap = {
  product_delete_bnt: async () => await deleteProduct(),
  product_edit_bnt: async () => await editProduct(),
};

$product_detail_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

const pageRender = async () => {
  const productResponse = await await productService.getProductByProductId(
    sessionStorage.getItem('p_id'),
  );
  const categoryResponse = await categoryService.getAllCategories();

  setCategoryObj(productResponse, categoryResponse);

  const {
    _id,
    sellerId,
    title,
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
  } = productResponse;

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
        <select class="category_select" name="category_select"></select>
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
        <input type='number' name='price' value="${price}">
      </div>
      <div>
        <input name='searchKeywords' value="${searchKeywords}">
      </div>
      <div>
        <input type='number' name='isRecommended' value="${isRecommended}">
      </div>
      <div>
        <input type='number' name='discountPercent' value="${discountPercent}">
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
  setSelectOption(document.querySelector('.category_select'), categoryId);
};

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
