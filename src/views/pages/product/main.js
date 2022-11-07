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

  categoryList.forEach((el) => {
    titles += `<li><a href="/${el._id}" onclick="">${el.title}</a></li>`;
  });

  $categoryList.innerHTML = `${titles}`;
};

// 모든 아이템 가져오기
const getAllItems = async () => {
  // 2. 문제, img src를 안정함
  let productsList = [];
  let $productsBox = document.querySelector('.products_box');
  let products = '';

  try {
    productsList = await getAPI('/api/products');
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }

  productsList.products.forEach((el) => {
    products += ` <div class="img_wrap">
        <a href="/product-detail/${el._id}"><img src="/public/images/products/driedFood/driedFood0.jpg" alt="${el.shortDescription}" /></a>
      </div>`;
  });

  $productsBox.innerHTML = `${products}`;
};

// 카테고리 별 아이템 가져오기
const getCategoryItems = () => {
  const allA = document.querySelectorAll('.category_tab li a');
  allA.forEach((el, index) => {
    el.addEventListener('click', async (e) => {
      // 탭 버튼이라 이동 이벤트 방지용
      e.preventDefault();

      allA.forEach((el) => el.classList.remove('on'));
      e.target.classList.add('on');

      if (index === 0) {
        getAllItems();
      } else {
        let selectedItems = [];
        let _id = e.target.href.split('/').pop();
        let $productsBox = document.querySelector('.products_box');
        let selectedBox = ``;

        try {
          selectedItems = await getAPI(`/api/products/category/${_id}`);
        } catch (err) {
          console.log('에러 발생!!');
          console.log(err);
        }
        selectedItems.forEach((el) => {
          selectedBox += `<div class="img_wrap">
          <a href="/product-detail/${el._id}"><img src="/public/images/products/driedFood/driedFood0.jpg" alt="${el.shortDescription}" /></a>
        </div>`;
        });
        $productsBox.innerHTML = `${selectedBox}`;
      }
    });
  });
};

// api json 불러오기
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
