/**
 * 1. 싱세 페이지 불러오는 방법이 어떻게 되지...
 *  -> API에 req를 함께 어떻게 보내면 될지 찾아보기
 *  = a태그 아이디 쏴줄값...
 * 2. img src 폴더와 명명법(분류imageKey로?)을 백이랑 안정함
 * 3. 자식 노드를 손쉽게 삭제 하는 방법은?
 *  결국 부모 태그를 따로 저장하고 삭제 후 다시 만들어서 넣는법인가 ㅠㅠ
 */

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
    titles += `<li><a href="/${el.title}" onclick="">${el.title}</a></li>`;
  });

  $categoryList.insertAdjacentHTML('beforeend', titles);
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
    /* ---1. a태그 /products/뒤에 쏴줄값 삽입 => 라우팅..? 해야하나? ---*/
    products += ` <div class="img_wrap">
        <a href="/products"><img src="${el.imageKey}" alt="${el.shortDescription}" /></a>
      </div>`;
  });
  //   $productsBox.remove('div');
  $productsBox.insertHTML = '';

  $productsBox.insertAdjacentHTML('beforeend', products);
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
        let apiLink = e.target.href.split('/').pop();
        // 예시 title: 'feed';
        // console.log(apiLink); // feed
        let $productsBox = document.querySelector('.products_box');
        let selectedBox = ``;

        try {
          selectedItems = await getAPI(`/api/products/category/${apiLink}`);
        } catch (err) {
          console.log('에러 발생!!');
          console.log(err);
        }
        selectedItems.forEach((el) => {
          selectedBox += `<div class="img_wrap">
          <a href="/products"><img src="${el.imageKey}" alt="${el.shortDescription}" /></a>
        </div>`;
        });
        $productsBox.insertAdjacentHTML('beforeend', selectedBox);
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
