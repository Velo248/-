import userService from '/public/scripts/userService.js';
import { errorUtil } from '/public/scripts/util.js';

const registerForm = document.querySelector('.registerForm');
const btnCancle = document.querySelector('.btn-cancle');

const email = document.querySelector('.email');
const userName = document.querySelector('.userName');
const password = document.querySelector('.password');
const password2 = document.querySelector('.password2');
const chkPolicy = document.getElementsByName('question');

const registerValid = (formObj) => {
  const formValue = errorUtil.invalidVariable(
    Object.values(formObj).every((v) => v),
  );

  const isEmailValid = errorUtil.isValidEmail(formObj.email);
  const isPasswordValid = errorUtil.isValidPW(
    formObj.password,
    formObj.password2,
  );

  if (!formValue) {
    alert('모든 형식을 입력해주세요.');
    return false;
  }
  if (!isEmailValid) {
    alert('이메일을 올바른 형식으로 입력해주세요. (ex) abc@gmail.com');
    email.focus();
    return false;
  }
  if (formValue.userName < 2) {
    alert('유저 이름을 2글자 이상 입력하세요');
    userName.focus();
    return false;
  }
  if (!isPasswordValid.code) {
    alert(isPasswordValid.err);
    password.value = '';
    password2.value = '';
    password.focus();
    return false;
  }
  if (!chkPolicy[0].checked) {
    alert('개인정보 제공에 동의하지 않으면 회원가입이 불가능합니다.');
    return false;
  }
  return true;
};

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const formObj = {};
  for (const key of formData.keys()) {
    formObj[key] = formData.get(key);
  }

  const vaild = registerValid(formObj);
  if (!vaild) return;

  const obj = {
    email: formObj.email,
    password: formObj.password,
    fullName: formObj.userName,
  };

  const response = await userService.register(obj);
  if (response) {
    alert('회원가입을 축하합니다');
    location.href = '/';
  }
});

btnCancle.addEventListener('click', () => (location.href = '/'));
