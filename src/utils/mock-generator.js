import { categoryModel, orderModel, productModel, userModel } from '../db';
import {
  orderMockData,
  categoryMockData,
  productMockData,
  userMockData,
} from './mock';

const adminUser = {
  fullName: 'Admin',
  email: 'admin1@test.com',
  password: '1234',
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

// 회원가입 api 요청
async function dataReset() {
  console.log('collections deleteAll...');
  // Promise.all([
  //   userModel.deleteAll(),
  //   productModel.deleteAll(),
  //   orderModel.deleteAll(),
  //   categoryModel.deleteAll(),
  // ]);
  await userModel.deleteAll();
  await productModel.deleteAll();
  await orderModel.deleteAll();
  await categoryModel.deleteAll();
}

async function dataPull() {
  console.log('data pulling...관계는 랜덤으로 배정됩니다');
  // Promise.all([
  //   //순서 중요 왜인지 모르겠으나
  //   //userModel.insertAll(userMockData)를 처음에 넣으면 안들어가짐
  //   //들어가지고 다시 지워지는건지?? 근데 밑에서 await dataReset 후에 실행하는데,,,

  //   productModel.insertAll(productMockData),
  //   orderModel.insertAll(orderMockData),
  //   categoryModel.insertAll(categoryMockData),
  //   userModel.insertAll(userMockData),
  // ]);
  // await productModel.insertAll(productMockData);
  // await orderModel.insertAll(orderMockData);
  // await categoryModel.insertAll(categoryMockData);
  // await userModel.insertAll(userMockData);
  const userIdList = [];
  for (let i = 0; i < userMockData.length; i++) {
    const { _id } = await userModel.create(userMockData[i]);
    userIdList.push(_id);
  }
  const newCategories = [];
  for (let i = 0; i < categoryMockData.length; i++) {
    const newCategory = await categoryModel.create(categoryMockData[i]);
    newCategories.push(newCategory);
  }

  for (let i = 0; i < productMockData.length; i++) {
    const randomN = Math.floor(
      (Math.random() * 100) % (newCategories.length - 1),
    );
    await productModel.create({
      ...productMockData[i],
      sellerId: userIdList[0],
      categoryId: newCategories[randomN]._id,
    });
  }

  for (let i = 0; i < orderMockData.length; i++) {
    const randomN = Math.floor((Math.random() * 100) % (userIdList.length - 1));
    await orderModel.create({
      ...orderMockData[i],
      userId: userIdList[randomN]._id,
    });
  }
}

async function mockGenerator() {
  await dataReset();
  await dataPull();
}

export { mockGenerator };
