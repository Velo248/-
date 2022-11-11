const makeCategoryList = async () => {
  let categoryList = [];
  let $categoryList = document.querySelector('.category_tab');
  let titles = '<li><a href="/all" class="on">All</a></li>';

  try {
    categoryList = await getAPI('/api/categories');
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }

  categoryList.forEach((list) => {
    titles += `<li><a href="/${list._id}" onclick="">${list.title}</a></li>`;
  });

  $categoryList.innerHTML = `${titles}`;
};

const getAllItems = async () => {
  let productsList = [];
  let $productsBox = document.querySelector('.products_box');
  let products = '';

  try {
    productsList = await getAPI('/api/products');
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }

  productsList.products.forEach((data) => {
    products += ` <div class="img_wrap">
        <a href="/product-detail/${data._id}"><img src="/public/images/${data.imageKey}.jpg" alt="${data.shortDescription}" /></a>
      </div>`;
  });

  $productsBox.innerHTML = `${products}`;
};

const getCategoryItems = () => {
  const allA = document.querySelectorAll('.category_tab li a');
  allA.forEach((el, index) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();

      allA.forEach((el) => el.classList.remove('on'));
      e.target.classList.add('on');

      if (index === 0) {
        getAllItems();
      } else {
        let selectedItems = [];
        const categoryId = e.target.href.split('/').pop();
        const $productsBox = document.querySelector('.products_box');
        let selectedBox = ``;

        try {
          selectedItems = await getAPI(
            `/api/categories/${categoryId}/products`,
          );
        } catch (err) {
          console.log('에러 발생!!');
          console.log(err);
        }
        selectedItems.forEach((data) => {
          selectedBox += `<div class="img_wrap">
            <a href="/product-detail/${data._id}"><img src="/public/images/${data.imageKey}.jpg" alt="${data.shortDescription}" /></a>
          </div>`;
          $productsBox.innerHTML = `${selectedBox}`;
        });
      }
    });
  });
};

const getAPI = async (url) => {
  return (await fetch(`${url}`)).json();
};

document.addEventListener('DOMContentLoaded', async () => {
  /* ----- 카테고리 리스트 만들기 ----- */
  await makeCategoryList();

  /* ----- ALL 탭에서 모든 제품 가져오기 ----- */
  await getAllItems();

  /* ----- 카테고리 별 아이템 불러오기 ----- */
  await getCategoryItems();
});
