import userService from '/public/scripts/userService.js';
import { errorUtil } from '/public/scripts/util.js';

const $loginForm = document.querySelector('.box-style-center');
const $findPassword = document.querySelector('.password-find');
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
    fetch('/api/send-mail/dormant', {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
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
$findPassword.addEventListener('click', (e) => {
  e.preventDefault();
  const email = prompt('이메일을 입력해주세요.');
  fetch('/api/send-mail', {
    method: `POST`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((res) => res.json())
    .then(console.log);
  alert('해당 이메일로 새로운 비밀번호를 발송하였습니다.');
});
$loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!submitEventMap[e.target.className]) return;
  submitEventMap[e.target.className](e.target);
});
