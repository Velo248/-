import userService from '/public/scripts/userService.js';
import orderService from '/public/scripts/orderService.js';

const getCurrentUser = async () => {
  return await (
    await fetch(`/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  ).json();
};

const signOutUser = async () => {
  return await (
    await fetch(`/api/users`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
  ).json();
};

const updateUpser = async (toUpdateObj) => {
  return await (
    await fetch(`/api/users`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify(toUpdateObj),
    })
  ).json();
};

const createUserSection = ({ fullName, email, phoneNumber }) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper flex-column';
  wrapper.innerHTML = `
        <div class="column">
            <div class="row">사용자명:</div>
            <div class="row username">${fullName}</div>
        </div>
        <div class="column">
            <div class="row">이메일:</div>
            <div class="row email">${email}</div>
        </div>
        <div class="column">
            <div class="row">전화번호:</div>
            ${
              phoneNumber
                ? `<input
                type="text"
                class="row phone"
                value="${phoneNumber}"
                placeholder="00000000000 -없이"
              />`
                : `<input
                type="text"
                class="row phone"
                placeholder="00000000000 -없이"
              />`
            }
            
        </div>
    `;
  return wrapper;
};

const signOutEventHandler = async (e) => {
  e.preventDefault();
  e.target.disabled = true;
  if (confirm('정말 탈퇴하시겠습니까?')) {
    const response = await signOutUser();
    if (response.acknowledged) {
      alert('탈퇴가 완료되었습니다.');
      sessionStorage.removeItem('token');
      location.href = '/';
    }
  }
  e.target.disabled = false;
  return;
};

const profileEditSubmitEventHandler = async (e) => {
  e.preventDefault();
  const phoneNumberInput = document.querySelector('.phone');
  const addressLongInput = document.querySelector('.address_long');
  const addressDetailInput = document.querySelector('.address_detail');
  const postalCodeInput = document.querySelector('.postal_code');
  const currentPasswordInput = document.querySelector('.password');

  const toUpdateObj = {
    address: {
      address1: addressLongInput.value,
      address2: addressDetailInput.value,
      postalCode: postalCodeInput.value,
    },
    phoneNumber: phoneNumberInput.value,
    currentPassword: currentPasswordInput.value,
  };

  const response = await updateUpser(toUpdateObj);
  if (response._id) {
    alert('수정이 완료되었습니다');
    location.href = '/profile';
  }
};

const init = async () => {
  const user = await getCurrentUser();

  const profileEditForm = document.querySelector('.profile_edit');
  profileEditForm.addEventListener('submit', profileEditSubmitEventHandler);

  const signOutBtn = document.querySelector('.sign_out');
  signOutBtn.addEventListener('click', signOutEventHandler);

  const profileWrapper = document.querySelector('.profile');
  profileWrapper.innerHTML = '';
  profileWrapper.appendChild(createUserSection(user));

  const addressLongInput = document.querySelector('.address_long');
  const addressDetailInput = document.querySelector('.address_detail');
  const postalCodeInput = document.querySelector('.postal_code');

  if (user.address) {
    const { address1, address2, postalCode } = user.address;
    addressLongInput.value = address1;
    addressDetailInput.value = address2;
    postalCodeInput.value = postalCode;
  }

  const addressSearchBtn = document.querySelector('.address_search');
  addressSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    new daum.Postcode({
      oncomplete: ({ zonecode, address }) => {
        addressLongInput.value = address;
        postalCodeInput.value = zonecode;
        addressDetailInput.disabled = false;
        addressDetailInput.focus();
        addressDetailInput.placeholder = '상세주소를 입력해주세요';
      },
    }).open();
  });
};

document.addEventListener('DOMContentLoaded', init);
