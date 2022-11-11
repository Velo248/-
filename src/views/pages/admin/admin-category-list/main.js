import { elementCreater } from '/public/scripts/util.js';
import categoryService from '/public/scripts/categoryService.js';

const $admin_category_wapper = document.querySelector('.admin_category_wapper');
const $admin_category_workspace = document.querySelector(
  '.admin_category_workspace',
);

const clickEventMap = {
  back_admin_main_bnt: () => (location.href = '/admin'),
  admin_category_edit_bnt: () => (location.href = '/admin/category/edit'),
};

$admin_category_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

const pageRender = async () => {
  const categories = await categoryService.getAllCategories();
  categories.forEach((e) => {
    const temp_html = `
    <div data-key=${e._id} class="category_item">
      ${e.title}
    </div>
    `;

    elementCreater($admin_category_workspace, temp_html);
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
