import productService from '/public/scripts/productService.js';

const keyword = window.location.href.split('=').pop();
const keywords = await productService.getProductBySearch(keyword);
const $counts = document.querySelector('.counts');
const $searchBox = document.querySelector('.search_box');

let str = ``;
keywords.forEach((data) => {
  str += `
    <div class="">
    <a href="/product-detail/${data._id}" data-id="el">
      <div class="img_wrap">
        <img
          src="/public/images/${data.imageKey}.jpg"
          alt="${data.title}"
        />
      </div>
      <div class="txt_wrap">
        <p>${data.manufacturer}</p>
        <span>${data.title}</span>
      </div>
    </a>
  </div>
    `;
});

$counts.innerHTML = `상품 ${keyword.length} 건`;
$searchBox.innerHTML = `${str}`;
