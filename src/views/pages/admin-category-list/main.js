const $admin_category_workspace = document.querySelector(
  '.admin_category_workspace',
);

const elementCreater = (current, add) => {
  current.innerHTML += add;
};

const pageRender = async () => {
  const categories = await getCategory();

  categories.forEach((e) => {
    elementCreater(
      $admin_category_workspace,
      `<div data-key=${e._id} class="category_item">${e.title}</div>`,
    );
  });

  return document.querySelectorAll('.category_item');
};

const getCategory = async () => {
  const respose = await fetch('/api/categorylist');
  return await respose.json();
};

const setClickEvent = (element) => {
  element.forEach((e) => {
    e.addEventListener('click', (event) => {
      console.log(event.target.getAttribute('data-key'));
    });
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  const $category_item = await pageRender();
  setClickEvent($category_item);
});
