const $admin_category_wapper = document.querySelector('.admin_category_wapper');
const $categories = document.querySelector('.categories');

let checkObj = {};

const customFetcher = async (data) => {
  const { target, dataObj, method } = data;

  const res = await fetch(`/api/categories/${target}`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(dataObj),
  });

  if (!res.ok) {
    const errorContent = await res.json();
    const { reason } = errorContent;

    throw new Error(reason);
  }

  delete checkObj[data];
};

const getCategory = async () => {
  const respose = await fetch('/api/categories');
  return await respose.json();
};

const elementCreater = (current, add) => {
  current.innerHTML += add;
};

const pageRender = async () => {
  const categories = await getCategory();
  console.log(categories);
  categories.forEach((e) => {
    const { _id, title, description, createdAt, updatedAt } = e;
    const createDate = `${createdAt.substring(0, 10)} ${createdAt.substring(
      11,
      16,
    )}`;
    const updateDate = `${updatedAt.substring(0, 10)} ${updatedAt.substring(
      11,
      16,
    )}`;

    const html_temp = `
      <div class="category_item">
        <form class='edit_form' id=${_id}>
          <input class='category_checked'type='checkbox'>
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

const deleteCategoryChecker = (target) => {
  const targetId = target.parentNode.getAttribute('id');
  if (target.checked) checkObj[targetId] = target.checked;
  else delete checkObj[targetId];
};

const deleteCategory = async () => {
  Object.keys(checkObj).forEach(async (e) => {
    const data = {
      target: e,
      dataObj: {},
      method: 'DELETE',
    };
    await customFetcher(data);
  });
  $categories.innerHTML = '';
  await pageRender();
};

const editCategoty = async (target) => {
  const formData = new FormData(target);
  const updateObj = {
    title: formData.get('category-title'),
    description: formData.get('category-description'),
  };

  const data = {
    target: target.getAttribute('id'),
    dataObj: updateObj,
    method: 'PATCH',
  };

  $categories.innerHTML = '';
  await customFetcher(data);
  await pageRender();
};

const createForm = async (target) => {
  const formData = new FormData(target);
  const updateObj = {
    title: formData.get('category-title'),
    description: formData.get('category-description'),
  };

  const data = {
    target: '',
    dataObj: updateObj,
    method: 'POST',
  };

  $categories.innerHTML = '';
  await customFetcher(data);
  await pageRender();
};

const clickEventMap = {
  selected_category_delete_bnt() {
    deleteCategory();
  },
  category_checked(e) {
    deleteCategoryChecker(e);
  },
  admin_edit_complete_bnt() {
    window.history.back(1);
  },
};

const submitEventMap = {
  edit_form(e) {
    editCategoty(e);
  },
  create_form(e) {
    createForm(e);
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

$admin_category_wapper.addEventListener('change', (e) => {});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
