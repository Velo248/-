export const elementCreater = (current, add) => {
  current.innerHTML += add;
};

export const dateFormet = (date) => {
  return `${date.substring(0, 10)} ${date.substring(11, 16)}`;
};

export const testLogin = async () => {
  const response = await (
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
  return response;
};

/**
 * @param {string} itemKey - localStroage에서 얻고자 하는 item의 key
 * @returns {object}
 */
export const getLocalStorageItem = (itemKey) => {
  return JSON.parse(localStorage.getItem(itemKey));
};

/**
 * @param {string} itemKey
 * @param {object | string} data
 * @returns {void}
 */
export const setLocalStorageItem = (itemKey, data) => {
  localStorage.setItem(itemKey, JSON.stringify(data));
  return;
};

/**
 * @param {string} str - 콤마가 포함된 숫자
 * @returns {number} - 콤마를 제거하고 10진수로 변환한 숫자
 */
export const parsePrice = (str) => parseInt(str.replace(/,/g, ''), 10);

export const errorUtil = {
  invalidVariable: (data) => {
    if (!data) {
      return false;
    }
    return true;
  },

  isValidEmail: (email) => {
    const reg =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return reg.test(email);
  },

  isValidPW: (password, confirmPassword) => {
    if (password.length < 8)
      return { code: false, err: 'password longer then 8' };
    if (password !== confirmPassword)
      return { code: false, err: 'password Not match' };

    const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return { code: reg.test(password) };
  },

  isValidPhoneNumber = (phoneNumber) => {
    const regex = new RegExp(/^010([0-9]{4})([0-9]{4})$/);
    return regex.test(phoneNumber);
  };
};
