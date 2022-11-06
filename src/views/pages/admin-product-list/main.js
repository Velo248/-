const $admin_product_wapper = document.querySelector('.admin_product_wapper');
const $products = document.querySelector('.products');

const getProduct = async () => {
  const respose = await fetch('/api/products');
  return await respose.json();
};

const getCategory = async () => {
  const respose = await fetch('/api/categories');
  return await respose.json();
};
const elementCreater = (current, add) => {
  current.innerHTML += add;
};
const pageRender = async () => {
  const responseProducts = await getProduct();
  const responseCategorise = await getCategory();
  const products = getCategoryTitleFromId(responseProducts, responseCategorise);

  products.forEach((product) => {
    const { _id, title, categoryTitle, shortDescription, manufacturer, price } =
      product;

    const html_temp = `
      <div class='product_item' data-key=${_id}>
        <div>
          <span>${title}</span>
        </div>
        <div>
          <span>${categoryTitle}</span>
        </div>
        <div>
          <span>${shortDescription}</span>
        </div>
        <div>
          <span>${manufacturer}</span>
        </div>
        <div>
          <span>${price}</span>
        </div>
        <div>
          <button class='detail_bnt'>상세</button>
        </div>
      </div>
    `;

    elementCreater($products, html_temp);
  });
};

const getCategoryTitleFromId = (product, category) => {
  let categoryObj = {};
  const newProduct = [];

  category.forEach((categorise) => {
    const { _id, title } = categorise;
    categoryObj[_id] = title;
  });

  product.forEach((products) => {
    const tempProduct = { ...products };
    tempProduct.categoryTitle = categoryObj[tempProduct.categoryId];
    newProduct.push(tempProduct);
  });

  return newProduct;
};

const productDetail = (productId) => {
  sessionStorage.setItem('p_id', productId);
  window.location.href = '/admin-product-detail';
};

const clickEventMap = {
  detail_bnt(e) {
    productDetail(e.parentNode.parentNode.getAttribute('data-key'));
  },
  back_admin_main_bnt() {
    location.href = '/admin-main';
  },
  create_product_bnt() {
    location.href = '/admin-product-adder';
  },
};

$admin_product_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
