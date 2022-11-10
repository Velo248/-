import { elementCreater } from '/public/scripts/util.js';
import categoryService from '/public/scripts/categoryService.js';
import adminService from '/public/scripts/adminService.js';

const $admin_product_wapper = document.querySelector('.admin_product_wapper');
const $category_select = document.querySelector('.category_select');

const categoryObj = {};

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

const productNameMatch = (productName) => {
  return Object.keys(categoryObj).find(
    (key) => categoryObj[key] === productName,
  );
};

const createProduct = async (target) => {
  const formData = new FormData(target);
  const createObj = {};

  for (const key of formData.keys()) {
    createObj[key] = formData.get(key);
  }
  createObj.categoryId = productNameMatch(createObj.category_select);
  createObj.imageKey = createObj.imageKey.name;
  createObj.isRecommended = createObj.isRecommended ? true : false;
  createObj.searchKeywords = createObj.searchKeywords.split(',');
  delete createObj.category_select;

  await adminService.createProduct(createObj);
  sessionStorage.removeItem('p_id');
  location.href = '/admin/product/list';
};

const submitEventMap = {
  create_form: createProduct,
};

const clickEventMap = {
  back_admin_main_bnt: () => (location.href = '/admin/product/list'),
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

const pageRender = async () => {
  const categories = await categoryService.getAllCategories();
  setCategoryMap(categories);
  setSelectOption();
};

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
