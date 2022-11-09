import { userModel } from '../db';
import { orderModel } from '../db';
import { cartModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserService {
  // 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
  constructor(userModel, orderModel) {
    this.userModel = userModel;
    this.orderModel = orderModel;
  }

  // 회원가입
  async addUser(userInfo) {
    // 객체 destructuring
    const { email, fullName, password, phoneNumber, address, role } = userInfo;

    // 이메일 중복 확인
    const user = await this.userModel.findByEmail(email);
    if (user) {
      throw new Error(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.',
      );
    }

    // 이메일 중복은 이제 아니므로, 회원가입을 진행함

    // 우선 비밀번호 해쉬화(암호화)
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

    // db에 저장
    const createdNewUser = await this.userModel.create(newUserInfo);

    return createdNewUser;
  }

  // 로그인
  async getUserToken(loginInfo) {
    // 객체 destructuring
    const { email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.',
      );
    }

    // 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash,
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.',
      );
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';
    // 로그인 성공시 쇼핑하던 장바구니 불러옴 없으면 새로운 장바구니 생성
    const cart = await cartModel.findOneByUserId(user._id);
    if (!cart) {
      await cartModel.create({ userId: user._id, orderSheets: [] });
    }
    // 2개 프로퍼티를 jwt 토큰에 담음
    // 관리자라면 토큰과 함께 주는 isAdmin속성을 true로 보내줌
    let isAdmin = false;
    if (user.role == 'admin') {
      isAdmin = true;
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

    //-----여기부터 휴면계정,비밀번호변경권고 로직들

    const logoutTime = user.loggedOutAt.getTime();
    const updatedAt = user.passwordUpdatedAt.getTime();
    const currentTime = Date.now();
    const miliSeconds = currentTime - updatedAt;
    const seconds = Math.floor(miliSeconds / 1000);
    const msg = `비밀번호 변경 한지 ${Math.floor(seconds / 60)}분 ${
      seconds % 60
    }초 지났습니다.`;
    const isPasswordUpdateNeeded = {
      value: false,
      msg,
    };
    //어드민은 패스워드 변경 권고를 안해줌
    if (user.role != 'admin') {
      //비밀번호 변경한지 30초가 지나면 권고하도록함. 원래는 30일이지만 시연할때 오래 기다릴수는 없으니
      if (seconds > 30) {
        isPasswordUpdateNeeded.value = true;
      }
    }

    const isDormantAccount = {
      value: false,
      msg: `id ${user._id} 유저 : 로그아웃 한지 ${Math.floor(
        (currentTime - logoutTime) / 1000,
      )}초 지났습니다.`,
    };
    if (user.role == 'dormant-account') {
      isDormantAccount.value = true;
    }

    //로그인 성공시 유저스키마의 loggedIn 상태를 true로 바꿔줌
    await this.userModel.update({
      userId: user._id,
      update: { loggedIn: true },
    });

    //-----여기까지 휴면계정,비밀번호변경권고 로직들

    return { token, isAdmin, isPasswordUpdateNeeded, isDormantAccount };
  }

  // 사용자 목록을 받음.
  async getUsers() {
    const users = await this.userModel.findAll();
    return users;
  }
  async getUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  //user의 order가져오기
  async getOrdersByUser(userId) {
    const orders = await this.orderModel.findByUserId(userId);
    return orders;
  }
  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userInfoRequired, toUpdate) {
    // 객체 destructuring
    const { userId, currentPassword } = userInfoRequired;
    console.log(userInfoRequired);
    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }
    // 비밀번호 일치 여부 확인
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
    // 이제 드디어 업데이트 시작
    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;
    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
      //비밀번호 변경하는 경우 비밀번호 변경 날짜 기입
      toUpdate.passwordUpdatedAt = new Date();
    }

    // 업데이트 진행
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });

    return user;
  }
  // setUser차이점 : 현재비밀번호없어도됨,
  async setUserByAdmin(userId, toUpdate) {
    // 우선 해당 id의 유저가 db에 있는지 확인
    let user = await this.userModel.findById(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 비밀번호 변경시, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;
    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
      //비밀번호 변경시 비밀번호 변경 날짜 기입
      toUpdate.passwordUpdatedAt = new Date();
    }
    // 업데이트 진행
    user = await this.userModel.update({
      userId,
      update: toUpdate,
    });
    return user;
  }
  async deleteUser(userId) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let user = await this.userModel.findById(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('delete error : 해당 유저를 찾을 수 없습니다.');
    }
    // 업데이트 진행
    user = await this.userModel.delete(userId);
    return user;
  }
  async setLogoutTime(userId) {
    const timestamp = new Date();
    const user = await this.userModel.update({
      userId,
      update: {
        loggedOutAt: timestamp,
        loggedIn: false,
      },
    });
    return user;
  }

  async dormantAccountCheck() {
    const users = await this.userModel.findAll();
    for (const user of users) {
      //만약 접속중이 아니라면 마지막 로그아웃 시간을 체크하여 휴면계정으로 돌림
      if (!user.loggedIn) {
        //어드민은 휴면계정으로 전환 안함 그리고 이미 휴면 계정인것은 체크안함
        if (user.role != 'admin' && user.role != 'dormant-account') {
          const logoutTime = user.loggedOutAt.getTime();
          const currentTime = Date.now();
          const miliSeconds = currentTime - logoutTime;
          const seconds = Math.floor(miliSeconds / 1000);
          const msg = `id ${user._id} 유저 : 로그아웃 한지 ${seconds}초 지났습니다.`;
          //로그아웃한지 30초가 지나면 휴면 계정으로 전환. 원래는 몇달이겠지만 시연할때 오래 기다릴수는 없으니
          if (seconds > 30) {
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
