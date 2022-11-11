const getAPI = async (url) => {
  return (await fetch(`${url}`)).json();
};

const makeCategoryList = async () => {
  let categoryList = [];
  const $categoryList = document.querySelector('.category_tab');
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
  const $productsBox = document.querySelector('.products_box');
  const $main = document.querySelector('.main_wrapper');
  let products = '';

  try {
    productsList = await getAPI('/api/products');
  } catch (err) {
    console.log('에러 발생!!');
    console.log(err);
  }
  const randomIndex = Math.floor(
    Math.random() * productsList.products.length - 1,
  );
  const randomItem = productsList.products[randomIndex];
  $main.innerHTML = `
    <div class="main_txt">
      <span class="color-pink fz-s bold">new!</span>
      <p>주인님들이 엄청 좋아하는</p>
      <div>${randomItem.title}</div>
      <a
        href="/product-detail/${randomItem._id}"
        class="bg-pink btn-s"
        >See details &gt;&gt;</a
      >
    </div>
    <div class="circle"></div>
    <div class="main_img">
      <img src="/public/images/${randomItem.imageKey}.jpg" alt="${randomItem.title}" />
    </div>`;

  // 메인에서는 아이템이 최대 8개만 표시되게
  let get8 = productsList.products.slice(0, 8);
  get8.forEach((data) => {
    products += ` <div class="img_wrap">
        <a href="/product-detail/${data._id}" data-id="el"><img src="/public/images/${data.imageKey}.jpg" alt="${data.shortDescription}" /></a>
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

        // 메인에서는 아이템이 최대 8개만 표시
        const get8 = selectedItems.slice(0, 8);
        get8.forEach((data) => {
          selectedBox += `<div class="img_wrap">
            <a href="/product-detail/${data._id}"><img src="/public/images/${data.imageKey}.jpg" alt="${data.shortDescription}" /></a>
          </div>`;
          $productsBox.innerHTML = `${selectedBox}`;
        });
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  /* ----- 카테고리 리스트 만들기 ----- */
  await makeCategoryList();

  /* ----- ALL 탭에서 모든 제품 가져오기 ----- */
  await getAllItems();

  /* ----- 카테고리 별 아이템 불러오기 ----- */
  await getCategoryItems();
});
