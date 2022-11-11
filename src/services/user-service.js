import { userModel } from '../db';
import { orderModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  constructor(userModel, orderModel) {
    this.userModel = userModel;
    this.orderModel = orderModel;
  }

  async addUser(userInfo) {
    const { email, fullName, password, phoneNumber, address, role } = userInfo;
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new Error(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserInfo = {
      fullName,
      email,
      password: hashedPassword,
      passwordUpdatedAt: new Date(),
      phoneNumber,
      address,
      role,
    };

    const createdNewUser = await this.userModel.create(newUserInfo);
    return createdNewUser;
  }

  async getUserToken(loginInfo) {
    const { email, password } = loginInfo;
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      );
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash,
    );
    if (!isPasswordCorrect) {
      throw new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
      );
    }

    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    let isAdmin = false;
    if (user.role == 'admin') {
      isAdmin = true;
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

    const loginTime = user.loggedInAt ? user.loggedInAt.getTime() : 0;
    const updatedAt = user.passwordUpdatedAt.getTime();
    const currentTime = Date.now();

    const seconds = Math.floor((currentTime - updatedAt) / 1000);
    const msg = user.passwordUpdatedAt
      ? `비밀번호 변경 한지 ${Math.floor(seconds / 60)}분 ${
          seconds % 60
        }초 지났습니다.`
      : `첫 로그인입니다.`;
    const isPasswordUpdateNeeded = {
      value: false,
      msg,
    };
    if (user.role != 'admin') {
      if (seconds > 30) {
        isPasswordUpdateNeeded.value = true;
      }
    }

    const dormantMsg = user.loggedInAt
      ? `마지막 로그인 이후로 ${Math.floor(
          (currentTime - loginTime) / 1000,
        )}초 지났습니다.`
      : `첫 로그인입니다.`;
    const isDormantAccount = {
      value: false,
      msg: dormantMsg,
    };
    await this.userModel.update({
      userId: user._id,
      update: {
        loggedInAt: new Date(),
        isLogIn: true,
      },
    });

    if (user.role == 'dormant-account') {
      isDormantAccount.value = true;
    }

    return { token, isAdmin, isPasswordUpdateNeeded, isDormantAccount };
  }

  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }
  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async getOrdersByUser(userId) {
    const orders = await this.orderModel.findByUserId(userId);
    return orders;
  }
  async setUser(userInfoRequired, toUpdate) {
    const { userId, currentPassword } = userInfoRequired;
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash,
    );
    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
      );
    }
    const { password } = toUpdate;
    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
      toUpdate.passwordUpdatedAt = new Date();
    }

    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }
  async setUserByAdmin(userId, toUpdate) {
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const { password } = toUpdate;
    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
      toUpdate.passwordUpdatedAt = new Date();
    }
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });
    return user;
  }
  async deleteUser(userId) {
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('delete error : 해당 유저를 찾을 수 없습니다.');
    }
    user = await this.userModel.delete(userId);
    return user;
  }
  async setLogoutTime(userId) {
    const timestamp = new Date();
    const user = await this.userModel.update({
      userId,
      update: {
        loggedOutAt: timestamp,
        isLogIn: false,
      },
    });
    return user;
  }

  async dormantAccountCheck() {
    const users = await this.userModel.findAll();
    for (const user of users) {
      if (!user.isLogIn) {
        if (
          user.role != 'admin' &&
          user.role != 'dormant-account' &&
          user.loggedInAt
        ) {
          const loginTime = user.loggedInAt.getTime();
          const currentTime = Date.now();
          const seconds = Math.floor(currentTime - loginTime / 1000);
          if (seconds > 10) {
            await this.userModel.update({
              userId: user._id,
              update: { role: 'dormant-account' },
            });
            console.log(`${user.fullName} 유저 휴면계정으로 전환되었습니다.`);
          }
        }
      }
    }
  }
}

const userService = new UserService(userModel, orderModel);

export { userService };
