import mongoose from 'mongoose';
import { mockGenerator } from '../utils/mock-generator';
import { dormantAccountCheckScheduler } from '../utils/dormant-scheduler';
if (process.env.MONGODB_URL === undefined) {
  throw new Error(
    '어플리케이션을 시작하려면 Mongo DB URL(MONGODB_URL) 환경변수가 필요합니다.',
  );
}

const DB_URL = process.env.MONGODB_URL;

mongoose.connect(DB_URL, {
  minPoolSize: 4, // min pool size 설정
  maxPoolSize: 20, // max pool size 설정
});
const db = mongoose.connection;

db.on('connected', async () => {
  await mockGenerator();
  // dormantAccountCheckScheduler();
  console.log('정상적으로 MongoDB 서버에 연결되었습니다.  ' + DB_URL);
});
db.on('error', (error) =>
  console.error('\nMongoDB 연결에 실패하였습니다...\n' + DB_URL + '\n' + error),
);

// user-model.js 에서 export { ~~ } 한 모듈을 그대로 다시 export해 줌
// 이렇게 하면, 나중에 import 할 때 코드가 짧아짐
// 예시로, import userModel from '../db/models/user-model' 대신 from '../db' 가 됨
// '../db/index.js' 에서 index.js 는 생략 가능하므로, '../db' 면 됨 (index는 특별한 용어)
export * from './models/user-model';
export * from './models/product-model';
export * from './models/category-model';
export * from './models/order-model';
export * from './models/cart-model';
export * from './models/basket-model';
