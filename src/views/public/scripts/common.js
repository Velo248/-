export const loggedInOnlyPageProtector = () => {
  const token = sessionStorage.getItem('token');
  if (token) return;
  else {
    return (location.href = '/login');
  }
};
