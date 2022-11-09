const btnCheck = document.querySelector('.btn-check');
const btnSubmit = document.querySelector('.btn-submit');
const btnCancle = document.querySelector('.btn-cancle');

const email = document.querySelector('.email');
const userName = document.querySelector('.userName');
const password = document.querySelector('.password');
const password2 = document.querySelector('.password2');
const chkPolicy = document.getElementsByName('question');

const postAPI = async (url, obj) => {
  return (
    await fetch(`${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
  ).json();
};

const sendJoin = () => {
  const info = {
    fullName: userName.value,
    email: email.value,
    password: password.value,
  };
  postAPI('/api/register', info);
  alert('회원가입이 완료되었습니다.');
  location.href = '/';
};

const chkJoin = () => {
  const isValidEmail = (data) => {
    let reg =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    let regText = reg.test(data);
    return regText;
  };

  const isValidPW = (data) => {
    let reg = /^[a-zA-Z0-9]{6,20}$/;
    let regText = reg.test(data);
    return regText;
  };

  // email 정규식 검사
  if (!isValidEmail(email.value)) {
    alert('이메일을 올바른 형식으로 입력해주세요. (ex) abc@gmail.com');
    email.focus();
    return false;
  }

  if (userName.value.length < 2) {
    alert('유저 이름을 2글자 이상 입력하세요');
    userName.focus();
    return false;
  }

  // 비밀번호가 일치하는지 검사
  if (password.value !== password2.value) {
    alert('비밀번호가 일치하지않습니다');
    password.value = '';
    password2.value = '';
    password.focus();
    return false;
  }

  // 비밀번호 정규식 검사
  if (!isValidPW(password.value)) {
    alert('영문과 하나 이상의 숫자를 포함하여 6자 이상 입력하세요');
    password.value = '';
    password2.value = '';
    password.focus();
    return false;
  }

  // 개인정보동의 했는지 검사
  if (!chkPolicy[0].checked) {
    alert('개인정보 제공에 동의하지 않으면 회원가입이 불가능합니다.');
    return false;
  }

  sendJoin();
};

const resetJoin = () => {
  location.href = '/';
};

btnSubmit.addEventListener('click', chkJoin);

btnCancle.addEventListener('click', resetJoin);
