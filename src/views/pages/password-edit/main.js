import userService from '/public/scripts/userService.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';
import { errorUtil } from '/public/scripts/util.js';

const currentPasswordInput = document.querySelector('.password');
const newPasswordInput = document.querySelector('.new_password');
const newPasswordConfirmInput = document.querySelector('.new_password_confirm');

const newPasswordConfirmChecker = () => {
  const { code, err } = errorUtil.isValidPW(
    newPasswordInput.value,
    newPasswordConfirmInput.value,
  );
  if (!err && !code) {
    err = '비밀번호 형식이 맞지 않습니다';
  }
  return { code, err, newPassword: newPasswordInput.value };
};

const updateUserPassword = async (currentPassword, newPassword) => {
  const response = await userService.updateUserInformation({
    currentPassword,
    password: newPassword,
  });
  if (response._id) {
    alert('비밀번호 수정이 완료되었습니다, 다시 로그인 해 주세요');
    localStorage.clear();
    sessionStorage.clear();
    location.href = '/login';
  } else {
    alert('실패');
    return;
  }
};

const finishPasswordEditHandler = async (e) => {
  e.preventDefault();
  //   const currentCheck = currentPasswordChecker();
  const currentPassword = currentPasswordInput.value;
  const newCheck = newPasswordConfirmChecker();
  if (!currentPassword) {
    alert('현재 비밀번호를 입력해주세요');
    currentPasswordInput.focus();
    return;
  } else if (!newCheck.code) {
    alert(newCheck.err);
    newPasswordConfirmInput.focus();
    return;
  } else {
    await updateUserPassword(currentPassword, newCheck.newPassword);
  }
};

const init = () => {
  loggedInOnlyPageProtector();
  const passwordEditForm = document.querySelector('.password_edit');
  passwordEditForm.addEventListener('submit', finishPasswordEditHandler);
};

document.addEventListener('DOMContentLoaded', init);
