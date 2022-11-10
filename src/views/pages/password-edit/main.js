import userService from '/public/scripts/userService.js';
import { loggedInOnlyPageProtector } from '/public/scripts/common.js';
import { errorUtil } from '/public/scripts/util.js';

const currentPasswordInput = document.querySelector('.password');
const newPasswordInput = document.querySelector('.new_password');
const newPasswordConfirmInput = document.querySelector('.new_password_confirm');

// const currentPasswordChecker = () => {
//   const currentPassword = currentPasswordInput.value;

//   if (currentPassword.length < 8) {
//     return { code: false, err: 'password longer then 8' };
//   }
//   const regex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
//   const test = regex.test(currentPassword);
//   if (test) {
//     return { code: test, currentPassword };
//   } else {
//     return { code: false, err: 'password 형식이 맞지 않습니다' };
//   }
// };

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
  const currentCheck = {
    code: true,
    currentPassword: currentPasswordInput.value,
  };
  const newCheck = newPasswordConfirmChecker();
  if (!currentCheck.code) {
    alert(currentCheck.err);
    currentPasswordInput.focus();
    return;
  } else if (!newCheck.code) {
    alert(newCheck.err);
    newPasswordConfirmInput.focus();
    return;
  } else {
    await updateUserPassword(
      currentCheck.currentPassword,
      newCheck.newPassword,
    );
  }
};

const init = () => {
  loggedInOnlyPageProtector();
  const passwordEditForm = document.querySelector('.password_edit');
  passwordEditForm.addEventListener('submit', finishPasswordEditHandler);
};

document.addEventListener('DOMContentLoaded', init);
