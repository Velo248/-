const $admin_product_wapper = document.querySelector('.admin_product_wapper');
const $category_select = document.querySelector('.category_select');

let categoryObj = {};

const elementCreater = (current, add) => {
  current.innerHTML += add;
};

const getCategory = async () => {
  const respose = await fetch('/api/categories');
  return await respose.json();
};

const setCategoryMap = async () => {
  const category = await getCategory();
  category.forEach((e) => {
    categoryObj[e._id] = e.title;
  });
};

const pageRender = async () => {
  await setCategoryMap();
  Object.values(categoryObj).forEach((categoryTitle) => {
    const temp_html = `
      <option value="${categoryTitle}">${categoryTitle}</option>
    `;
    elementCreater($category_select, temp_html);
  });
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
  createObj.searchKeywords = formData.get('searchKeywords');
  createObj.isRecommended = formData.get('isRecommended') ? true : false;
  createObj.discountPercent = formData.get('discountPercent');

  const data = {
    target: '',
    dataObj: createObj,
    method: 'POST',
  };

  await customFetcher(data);
  sessionStorage.removeItem('p_id');
  window.location.href = '/admin-main';
};

const submitEventMap = {
  create_form(e) {
    createProduct(e);
  },
};

const clickEventMap = {
  back_admin_main_bnt() {
    window.location.href = '/admin-main';
  },
};

$admin_product_wapper.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!submitEventMap[e.target.className]) return;
  submitEventMap[e.target.className](e.target);
});

$admin_product_wapper.addEventListener('click', (e) => {
  console.log(e.target);
  if (!clickEventMap[e.target.className]) return;
  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});

const customFetcher = async (data) => {
  const { target, dataObj, method } = data;
  console.log(target, dataObj, method);

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
};
