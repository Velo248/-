import userService from '/public/scripts/userService.js';
import { errorUtil } from '/public/scripts/util.js';

const $loginForm = document.querySelector('.box-style-center');

const login = async (data) => {
  const formData = new FormData(data);
  const email = formData.get('email');
  const password = formData.get('password');

  const invalidVariable = errorUtil.invalidVariable(
    [email, password].every((v) => v),
  );

  if (!invalidVariable) return alert('입력정보를 확인해주세요.');

  const response = await userService.login(email, password);
  const { isAdmin, token, isDormantAccount, isPasswordUpdateNeeded } = response;

  if (isAdmin) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('isAdmin', isAdmin);

    alert('관리자 유저 로그인 성공');
    location.href = '/admin';
    return;
  }

  //이메일 발송로직 추가
  if (isDormantAccount.value) {
    alert('장기 미접속으로 휴면계정으로 바뀌었습니다. 이메일을 확인해주세요.');
    return;
  }

  sessionStorage.setItem('token', token);
  sessionStorage.setItem('isAdmin', isAdmin);
  sessionStorage.setItem(
    'isPasswordUpdateNeeded',
    isPasswordUpdateNeeded.value,
  );
  location.href = '/';
};

const submitEventMap = {
  login: login,
};

$loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!submitEventMap[e.target.className]) return;
  submitEventMap[e.target.className](e.target);
});
