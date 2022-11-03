/**
 * JSON 파일 만들고 DOM 집어서 그안에 차례로 삽입
 *
 *
 */

const $categoriesWrap = document.querySelector('.categories_wrap');
const $productsWrap = document.querySelector('.products_wrap');

// 하드코딩 데이터
const categories = {
  //   list: ['driedFood', 'wetFood', 'feed', 'goods'],
  list: ['건식사료', '습식사료', '간식', '용품'],
};

const items = [
  {
    id: 1234,
    product_name: '고양이 사료',
    price: 6000,
    brand: '로얄캐닌',
    category: '사료',
    src: '0',
  },
  {
    id: 1234,
    product_name: 'bird feed',
    price: 6000,
    brand: 'bird Brand',
    category: 'feed',
    src: '1',
  },
  {
    id: 1234,
    product_name: 'bird feed',
    price: 6000,
    brand: 'bird Brand',
    category: 'feed',
    src: '0',
  },
  {
    id: 1234,
    product_name: 'bird feed',
    price: 6000,
    brand: 'bird Brand',
    category: 'feed',
    src: '1',
  },
  {
    id: 1234,
    product_name: 'bird feed',
    price: 6000,
    brand: 'bird Brand',
    category: 'feed',
    src: '0',
  },
];

const makeCategory = () => {
  let str = '';
  categories.list.forEach((el) => {
    str += `<li><a href="#">${el}</a></li>`;
  });
  return str;
};

const makeProducts = () => {
  let str = '';
  items.forEach((el) => {
    str += `<div class="img_wrap">
    <a href="../users/products">
    <img src="../../public/images/products/driedFood/driedFood${el.src}.jpg" alt="${el.product_name}"/>
    </a>
    </div> `;
  });
  return str;
};

$categoriesWrap.insertAdjacentHTML('afterbegin', makeCategory());
$productsWrap.insertAdjacentHTML('afterbegin', makeProducts());
