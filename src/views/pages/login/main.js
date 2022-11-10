import userService from '/public/scripts/userService.js';

const $loginEmail = document.querySelector('.login-email');
const $loginPassword = document.querySelector('.login-pw');
const $loginBtn = document.querySelector('.login-btn');

// 로그인 요청
$loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const email = $loginEmail.value;
  const password = $loginPassword.value;

  const response = await userService.login(email, password);

  if (response.isAdmin && response.token) {
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('isAdmin', response.isAdmin);

    alert('관리자 유저 로그인 성공');
    location.href = '/admin';
    return;
  }

  sessionStorage.setItem('token', response.token);
  sessionStorage.setItem('isAdmin', response.isAdmin);
  location.href = '/';

  $loginEmail.value = '';
  $loginPassword.value = '';
});
