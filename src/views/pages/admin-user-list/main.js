const $admin_user_wapper = document.querySelector('.admin_user_wapper');
const $user_list = document.querySelector('.user_list');

const getUsers = async () => {
  const data = {
    target: '',
    method: 'GET',
  };

  const response = await customFetcher(data);
  return await response.json();
};

const elementCreater = (current, add) => {
  current.innerHTML += add;
};

const pageRender = async () => {
  const users = await getUsers();
  users.forEach((user) => {
    const temp_html = `
      <div><span>${user.fullName}</span></div>
      <div><span>${user.email}</span></div>
      <div data-key="${user._id}"><button class='user_detail_bnt'>상세</button></div>
    `;

    elementCreater($user_list, temp_html);
  });
};

const userDetail = (target) => {
  const userId = target.parentNode.getAttribute('data-key');
  window.sessionStorage.setItem('u_id', userId);
  window.location.href = '/admin-user-detail';
};

const clickEventMap = {
  user_detail_bnt(e) {
    userDetail(e);
  },
  back_admin_main_bnt() {
    window.location.href = '/admin-main';
  },
};

$admin_user_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});

const customFetcher = async (data) => {
  const { target, dataObj, method } = data;

  const res = await fetch(`/api/users/${target}`, {
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

  return res;
};
