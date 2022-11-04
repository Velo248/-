/**
 * JSON 파일 만들고 DOM 집어서 그안에 차례로 삽입
 *
 *
 */

const getAPI = async (url) => {
  return (await fetch(`${url}`)).json();
};

const makeCategoryList = async () => {
  let categoryList = [];
  let $categoryList = document.querySelector('.category_list');
  let titles = '<li><a href="/all">All</a></li>';

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

  productsList.forEach((el) => {
    // console.log(el);
    /* src, imageKey 정하고 풀어주기*/
    // console.log(el.imageKey);
    // console.log(el.shortDescription);
    /* ---4. a태그 /products/뒤에 쏴줄값 삽입 => 라우팅 해야하나? ---*/
    products += ` <div class="img_wrap">
        <a href="/products"><img src="/public/images/products/driedFood/driedFood0.jpg" alt="${el.shortDescription}" /></a>
      </div>`;
  });

  $productsBox.innerHTML = `${products}`;
};

const openDetail = (e) => {
  e.preventDefault();
  const targetLink = e.target.href.split('/').pop();
  console.log(e.target.dataset.itemId);
};

// 카테고리 별 아이템 가져오기
const getCategoryItems = () => {
  const allA = document.querySelectorAll('.category_list li a');
  allA.forEach((el, index) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();

      if (index === 0) {
        getAllItems();
      } else {
        let selectedItems = [];
        let _id = e.target.href.split('/').pop();
        // 예시 title: 'feed';
        // console.log(apiLink); // feed
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
          <a href="/products"><img src="/public/images/products/driedFood/driedFood0.jpg" alt="${el.shortDescription}" /></a>
        </div>`;
        });
        $productsBox.innerHTML = `${selectedBox}`;
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
