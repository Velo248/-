export const elementCreater = (current, add) => {
  current.innerHTML += add;
};

export const dateFormet = (date) => {
  return `${date.substring(0, 10)} ${date.substring(11, 16)}`;
};
