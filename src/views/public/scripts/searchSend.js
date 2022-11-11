const searchSend = async (target) => {
  target.preventDefault();
  const formData = new FormData(target);
  const createObj = {};

  for (const key of formData.keys()) {
    createObj[key] = formData.get(key);
  }

  console.log(createObj.keyword);
  location.href = `/search/?keyword=${createObj.keyword}`;
};

export default searchSend;
Object.freeze(searchSend);
