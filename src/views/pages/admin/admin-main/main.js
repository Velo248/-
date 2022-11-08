const $admin_work_container = document.querySelectorAll(
  '.admin_work_container',
);
const linkMap = {
  0: '/admin/category/list',
  1: '/admin/product/list',
  2: '/admin/user/list',
  3: '/admin/order/list',
};

$admin_work_container.forEach((e, idx) => {
  e.addEventListener('click', () => {
    location.href = linkMap[idx];
  });
});
