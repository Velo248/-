const $loginEmail = document.querySelector('.login-email');
const $loginPassword = document.querySelector('.login-pw');
const $loginBtn = document.querySelector('.login-btn');

const postAPI = async (url, obj) => {
  return (
    await fetch(`${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(obj),
    })
  ).json();
};

// 로그인 요청
$loginBtn.addEventListener('click', async (e) => {
  console.log('abc');
  e.preventDefault();

  let headerObj = {
    email: $loginEmail.value,
    password: $loginPassword.value,
  };

  let data = await postAPI('/api/login', headerObj);
  const token = data.token;
  sessionStorage.setItem('token', token);
});
