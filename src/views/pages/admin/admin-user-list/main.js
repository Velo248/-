import { elementCreater } from '/public/scripts/util.js';
import adminService from '/public/scripts/adminService.js';

const $admin_user_wapper = document.querySelector('.admin_user_wapper');
const $user_list = document.querySelector('.user_list');

const pageRender = async () => {
  const users = await adminService.getAllUser();

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
  sessionStorage.setItem('u_id', userId);
  location.href = '/admin/user/detail';
};

const clickEventMap = {
  user_detail_bnt: userDetail,
  back_admin_main_bnt: () => (location.href = '/admin'),
};

$admin_user_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
