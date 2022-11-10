export const loggedInOnlyPageProtector = () => {
  const token = sessionStorage.getItem('token');
  if (token) return;
  else {
    return (location.href = '/login');
  }
};

export const isValidPhoneNumber = (phoneNumber) => {
  const regex = new RegExp(/^010([0-9]{4})([0-9]{4})$/);
  return regex.test(phoneNumber);
};
