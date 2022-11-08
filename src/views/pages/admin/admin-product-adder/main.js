import { elementCreater } from '/public/scripts/util.js';
import categoryService from '/public/scripts/categoryService.js';
import adminService from '/public/scripts/adminService.js';

const $admin_product_wapper = document.querySelector('.admin_product_wapper');
const $category_select = document.querySelector('.category_select');

const categoryObj = {};

const getCategory = async () => {
  const response = await categoryService.getAllCategories();
  return response;
};

const setCategoryMap = (target) => {
  target.forEach((categoty) => {
    categoryObj[categoty._id] = categoty.title;
  });
};

const setSelectOption = () => {
  Object.values(categoryObj).forEach((categoryTitle) => {
    const temp_html = `
      <option value="${categoryTitle}">${categoryTitle}</option>
    `;
    elementCreater($category_select, temp_html);
  });
};
const pageRender = async () => {
  const categories = await getCategory();
  setCategoryMap(categories);
  setSelectOption();
};

const createProduct = async (target) => {
  const formData = new FormData(target);
  const createObj = {};

  const categoryId = Object.keys(categoryObj).find(
    (key) => categoryObj[key] === formData.get('category_select'),
  );

  createObj.categoryId = categoryId;
  createObj.title = formData.get('title');
  createObj.sellerId = formData.get('sellerId');
  createObj.manufacturer = formData.get('manufacturer');
  createObj.shortDescription = formData.get('shortDescription');
  createObj.detailDescription = formData.get('detailDescription');
  createObj.imageKey = formData.get('imageKey').name;
  createObj.inventory = formData.get('inventory');
  createObj.price = formData.get('price');
  createObj.searchKeywords = formData.get('searchKeywords').split(',');
  createObj.isRecommended = formData.get('isRecommended') ? true : false;
  createObj.discountPercent = formData.get('discountPercent');

  await adminService.createProduct(createObj);
  sessionStorage.removeItem('p_id');
  window.location.href = '/admin/product/list';
};

const submitEventMap = {
  create_form(e) {
    createProduct(e);
  },
};

const clickEventMap = {
  back_admin_main_bnt() {
    window.location.href = '/admin/product/list';
  },
};

$admin_product_wapper.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!submitEventMap[e.target.className]) return;
  submitEventMap[e.target.className](e.target);
});

$admin_product_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;
  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
