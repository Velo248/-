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
  await userModel.deleteAll();
  await productModel.deleteAll();
  await orderModel.deleteAll();
  await categoryModel.deleteAll();
}

async function dataPull() {
  console.log('data pulling...');
  await userModel.insertAll(userMockData());
  await productModel.insertAll(productMockData());
  await orderModel.insertAll(orderMockData());
  await categoryModel.insertAll(categoryMockData());
}

async function mockGenerator() {
  await dataReset();
  await dataPull();
}

export { mockGenerator };
