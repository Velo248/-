import {
  categoryModel,
  orderModel,
  productModel,
  userModel,
  cartModel,
} from '../db';
import {
  orderMockData,
  categoryMockData,
  productMockData,
  userMockData,
} from './mock';

// 데이터 전부 삭제
async function dataReset() {
  console.log('collections deleteAll...');

  await userModel.deleteAll();
  await productModel.deleteAll();
  await orderModel.deleteAll();
  await categoryModel.deleteAll();
  await cartModel.deleteAll();
}
//더미데이터 삽입
async function dataPull() {
  console.log('data pulling...관계는 랜덤으로 배정됩니다');

  const userIdList = [];
  for (const data in userMockData) {
    const { _id } = await userModel.create(userMockData[data]);
    userIdList.push(_id);
  }
  const newCategories = [];
  for (const data in categoryMockData) {
    const newCategory = await categoryModel.create(categoryMockData[data]);
    newCategories.push(newCategory);
  }

  for (const data in productMockData) {
    const randomN = Math.floor(
      (Math.random() * 100) % (newCategories.length - 1),
    );
    await productModel.create({
      ...productMockData[data],
      sellerId: userIdList[0],
      categoryId: newCategories[randomN]._id,
    });
  }
  for (const data in orderMockData) {
    const randomN = Math.floor((Math.random() * 100) % (userIdList.length - 1));
    await orderModel.create({
      ...orderMockData[data],
      userId: userIdList[randomN]._id,
    });
  }
}

async function mockGenerator() {
  await dataReset();
  await dataPull();
}

export { mockGenerator };
