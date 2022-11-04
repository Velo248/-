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
