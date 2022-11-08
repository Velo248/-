import { elementCreater, dateFormet } from '/public/scripts/util.js';
import productService from '/public/scripts/productService.js';
import categoryService from '/public/scripts/categoryService.js';
import adminService from '/public/scripts/adminService.js';

const $product_detail_wapper = document.querySelector('.product_detail_wapper');
const $product = document.querySelector('.product');

const categoryObj = {};

const getProduct = async () => {
  const response = await productService.getProductByProductId(
    sessionStorage.getItem('p_id'),
  );
  return response;
};

const getCategory = async () => {
  const response = await categoryService.getAllCategories();
  return response;
};

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

const pageRender = async () => {
  const productResponse = await getProduct();
  const categoryResponse = await getCategory();

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

const deleteProduct = async () => {
  if (confirm('진심 삭제함?')) {
    await adminService.deleteProductByProductId(sessionStorage.getItem('p_id'));
    return (location.href = '/admin/product/list');
  }
  return;
};

const editProduct = async () => {
  const $edit_form = document.querySelector('.edit_form');
  const formData = new FormData($edit_form);

  const productId = $edit_form.getAttribute('id');
  const categoryId = Object.keys(categoryObj).find(
    (key) => categoryObj[key] === formData.get('category_select'),
  );

  const updateObj = {};
  updateObj.categoryId = categoryId;
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

  await adminService.setProductInformationByProductId(productId, updateObj);
  sessionStorage.removeItem('p_id');
  location.href = '/admin/product/list';
};

const clickEventMap = {
  async product_delete_bnt() {
    await deleteProduct();
  },

  async product_edit_bnt() {
    await editProduct();
  },
};

$product_detail_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
