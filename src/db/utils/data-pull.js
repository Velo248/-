import { categoryModel, orderModel, productModel, userModel } from '../../db';

// 회원가입 api 요청
const adminUser = {
  fullName: 'Admin',
  email: 'admin@test.com',
  password: '123123123',
  role: 'admin',
};
const category = {
  title: 'feed',
  description: 'blah-blah',
  themeClass: 'is-black',
  imageKey: '{path}/elice.png',
};

const product = {
  title: '여성 청바지',
  sellerId: '634fcbe23192f3965bc65015',
  categoryId: '임시아이디',
  manufacturer: '바지나라',
  shortDescription: '여성용 여름 청바지',
  detailDescription: '시원하고 편안한 청바지로 여름철에 입기 제격입니다.',
  imageKey:
    '%EC%B2%AD%EB%B0%94%EC%A7%80/xnfaj_tamara-bellis-zDyJOj8ZXG0-unsplash.jpg',
  inventory: 25,
  price: 29000,
  searchKeywords: ['여자옷', '청바지', '여름'],
  isRecommended: false,
  discountPercent: 0,
};

const order = {
  summaryTitle: '베이직 티셔츠 / 1개',
  totalPrice: 16000,
  address: {
    postalCode: '36752',
    address1: '경북 안동시 정하동 234-1 ',
    address2: '테스트입니다',
    receiverName: '이순신',
    receiverPhoneNumber: '01022123222',
  },
  request: '부재 시 문 앞에 놓아주세요.',
};
async function dataReset() {
  console.log('bye');
  await userModel.deleteAll();
  await productModel.deleteAll();
  await orderModel.deleteAll();
  await categoryModel.deleteAll();
  dataPull();
}

async function dataPull() {
  const { _id } = await userModel.create(adminUser);
  const newCategory = await categoryModel.create(category);
  console.log(newCategory._id);
  await productModel.create({ ...product, categoryId: newCategory._id });
  await orderModel.create({ ...order, userId: _id });
  console.log('bye');
}

export { dataReset };
