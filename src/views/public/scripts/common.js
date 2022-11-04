export const decodeJwt = (token) => {
  const base64 = token.split('.')[1];
  const payload = atob(base64);

  return JSON.parse(payload);
};
