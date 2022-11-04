import { categoryModel, orderModel, productModel, userModel } from '../db';
import {
  orderMockData,
  categoryMockData,
  productMockData,
  userMockData,
} from './mock';

// 회원가입 api 요청
async function dataReset() {
  console.log('collections deleteAll...');
  Promise.all([
    userModel.deleteAll(),
    productModel.deleteAll(),
    orderModel.deleteAll(),
    categoryModel.deleteAll(),
  ]);
}

async function dataPull() {
  console.log('data pulling...');
  Promise.all([
    //순서 중요 왜인지 모르겠으나
    //userModel.insertAll(userMockData)를 처음에 넣으면 안들어가짐
    //들어가지고 다시 지워지는건지?? 근데 밑에서 await dataReset 후에 실행하는데,,,
    userModel.insertAll(userMockData),
    productModel.insertAll(productMockData),
    orderModel.insertAll(orderMockData),
    categoryModel.insertAll(categoryMockData),
  ]);
}

async function mockGenerator() {
  await dataReset();
  await dataPull();
}

export { mockGenerator };
