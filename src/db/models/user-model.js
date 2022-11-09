import { model } from 'mongoose';
import { UserSchema } from '../schemas/user-schema';

const User = model('users', UserSchema);

export class UserModel {
  async findByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async findById(userId) {
    const user = await User.findOne({ _id: userId });
    return user;
  }

  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }

  async findAll() {
    const users = await User.find({});
    return users;
  }

  async update({ userId, update }) {
    const filter = { _id: userId };
    const option = { returnOriginal: false };
    console.log(filter);
    console.log(update);
    const updatedUser = await User.findOneAndUpdate(filter, update, option);
    return updatedUser;
  }

  async deleteAll() {
    await User.deleteMany({});
  }
  async insertAll(data) {
    await User.insertMany(data);
  }

  async delete(userId) {
    const user = await User.deleteOne({ _id: userId });
    return user;
  }
  //리펙토링시 결정
  async find(query, projection, sort = { id: 1 }, options = { lean: true }) {
    return User.find(query, projection, options).sort(sort).exec();
  }
  async findOne(query, projection, options = { lean: true }) {
    return await User.findOne(query, projection, options).exec();
  }
  async createWithTimestamp(userInfo) {
    userInfo.passwordUpdatedAt = new Date();
    const createdNewUser = await User.create(userInfo);
    return createdNewUser;
  }
}

const userModel = new UserModel();

export { userModel };
