import { elementCreater, dateFormet } from '/public/scripts/util.js';
import categoryService from '/public/scripts/categoryService.js';

const $admin_category_wapper = document.querySelector('.admin_category_wapper');
const $categories = document.querySelector('.categories');

const checkObj = {};

const getCategory = async () => {
  const response = await categoryService.getAllCategories();
  return response;
};

const pageRender = async () => {
  const categories = await getCategory();

  categories.forEach((e) => {
    const { _id, title, description, createdAt, updatedAt } = e;
    const createDate = dateFormet(createdAt);
    const updateDate = dateFormet(updatedAt);

    const html_temp = `
      <div class="category_item">
        <form class='edit_form' id=${_id}>
          <input class='category_checked' type='checkbox'>
          <input name='category-title' value="${title}">
          <input name='category-description' value="${description}">
          <span>${createDate}</span>
          <span>${updateDate}</span>
          <button class='edit_bnt' type='submit'>수정하기</button>
        </form>
      </div>
    `;

    elementCreater($categories, html_temp);
  });
};

const editCategoty = async (target) => {
  const formData = new FormData(target);

  const updateObj = {
    title: formData.get('category-title'),
    description: formData.get('category-description'),
  };

  const categoryId = target.getAttribute('id');

  await categoryService.setCategoryInfomation(categoryId, updateObj);
  $categories.innerHTML = '';
  await pageRender();
};

const createCategory = async (target) => {
  const formData = new FormData(target);

  const createObj = {
    title: formData.get('create-category-title'),
    description: formData.get('create-category-description'),
  };

  const $title = document.querySelector('[name="create-category-title"]');
  const $description = document.querySelector(
    '[name="create-category-description"]',
  );
  $title.value = '';
  $description.value = '';

  await categoryService.addCategory(createObj);

  $categories.innerHTML = '';
  await pageRender();
};

const deleteCategory = async () => {
  const categoryId = Object.keys(checkObj);
  for (const id of categoryId) {
    await categoryService.deleteCategory(id);
    delete checkObj[id];
  }
  $categories.innerHTML = '';
  await pageRender();
};

const deleteCategoryChecker = (target) => {
  const targetId = target.parentNode.getAttribute('id');
  if (target.checked) checkObj[targetId] = target.checked;
  else delete checkObj[targetId];
};

const allCheckboxChanger = (target) => {
  const $category_checked = document.querySelectorAll('.category_checked');
  $category_checked.forEach((checkbox) => {
    checkbox.checked = target.checked;
    deleteCategoryChecker(checkbox);
  });
};

const clickEventMap = {
  selected_category_delete_bnt() {
    deleteCategory();
  },
  category_checked(e) {
    deleteCategoryChecker(e);
  },
  all_check(e) {
    allCheckboxChanger(e);
  },
  admin_edit_complete_bnt() {
    location.href = '/admin/category/list';
  },
};

const submitEventMap = {
  edit_form(e) {
    editCategoty(e);
  },
  create_form(e) {
    createCategory(e);
  },
};

$admin_category_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

$admin_category_wapper.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!submitEventMap[e.target.className]) return;

  submitEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
