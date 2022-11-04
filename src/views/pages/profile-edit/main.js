const testLogin = async () => {
  const { token } = await (
    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'elice1@test.com',
        password: '1234',
      }),
    })
  ).json();

  return token;
};
const getCurrentUser = async () => {
  // const token = sessionStorage.getItem('token');
  const token = await testLogin();
  const user = await (
    await fetch('/api/user', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  ).json();

  return user;
};

const init = async () => {
  const token = await testLogin();

  const signOutAnchor = document.querySelector('.sign_out');
  signOutAnchor.addEventListener('click', (e) => e.preventDefault());
  // signOutAnchor.addEventListener('click', async (e) => {
  //   e.preventDefault();
  //   if (confirm('정말 탈퇴하시겠습니까?')) {
  //     try {
  //       // if {result: ok} -> 탈퇴 완료 -> main으로 이동
  //       // if not -> alert 탈퇴 실패
  //       // const response = await (await fetch()).json();
  //       if (true) {
  //         alert('탈퇴가 완료되었습니다. 안녕히 가세요');
  //         location.href = '/';
  //       } else {
  //         alert('탈퇴에 실패했습니다');
  //         location.reload();
  //       }
  //     } catch (err) {}
  //   }
  // });
  const user = await getCurrentUser();

  const username = document.querySelector('.username');
  const email = document.querySelector('.email');
  const phone = document.querySelector('.phone');
  const addressLong = document.querySelector('.address-long');
  const addressDetail = document.querySelector('.address-detail');
  const postalCode = document.querySelector('.postal-code');

  username.innerText = user.fullName;
  email.innerText = user.email;
  phone.innerText = user.phone;
  if (user.address) {
    addressLong.innerText = user.address.address1;
    addressDetail.value = user.address.address2;
    postalCode.innerText = user.address.postalCode;
  }

  const addressSearchBtn = document.querySelector('.address_search');
  addressSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: ({ zonecode, address }) => {
        addressLong.innerText = address;
        postalCode.innerText = zonecode;
        addressDetail.disabled = false;
      },
    }).open();
  });

  const form = document.querySelector('.form');
  const passwordInput = document.querySelector('.password');
  // 배송지 수정 form의 event
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phoneNumber = phone.value;
    const password = passwordInput.value;
    console.log(password);
    if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        phoneNumber,
      )
    ) {
      alert('전화번호 형식이 맞지 않습니다.');
      phone.focus();
    }
    const address = {
      address1: addressLong.textContent,
      address2: addressDetail.value,
      postalCode: postalCode.textContent,
    };
    // fetch patch
    // if reuslt: ok -> ~
    const response = await (
      await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address,
          phoneNumber,
          currentPassword: password,
        }),
      })
    ).json();

    console.log(response);
  });
};

document.addEventListener('DOMContentLoaded', init);
