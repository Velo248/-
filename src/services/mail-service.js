import { userModel } from '../db';
import { sendPasswordMail, sendDormantMail } from '../utils/send-mail';
import http from 'http';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { resolve } from 'path';
import { rejections } from 'winston';
class MailService {
  constructor(userModel) {
    this.userModel = userModel;
  }
  sendPasswordFindMail(email, password, ip) {
    return new Promise((resolve, reject) => {
      http
        .get(
          `http://ip-api.com/json/${ip}?fields=country,city,regionName`,
          (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', async () => {
              data = JSON.parse(data);
              const info = await sendPasswordMail(email, password, data);
              resolve(info);
            });
          },
        )
        .on('error', (err) => {
          throw err;
        });
    });
  }
  sendDormantAccountMail(email, ip) {
    return new Promise((resolve, reject) => {
      http
        .get(
          `http://ip-api.com/json/${ip}?fields=country,city,regionName`,
          (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', async () => {
              data = JSON.parse(data);
              const info = await sendDormantMail(email, data);
              resolve(info);
            });
          },
        )
        .on('error', (err) => {
          throw err;
        });
    });
  }
  async findUserByEmail(email) {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('해당 이메일은 존재하지 않는 계정입니다.');
    }
    return user;
  }
  async setRandomPassword(user) {
    const userId = user._id;
    const randomPassword = crypto.randomBytes(4).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const update = {
      password: hashedPassword,
      passwordUpdatedAt: new Date(),
    };
    await this.userModel.update({ userId, update });
    return randomPassword;
  }
  async recoverDormantAccount(email) {
    const user = await this.userModel.findByEmail(email);
    const userId = user._id;
    const update = {
      role: 'basic-----user',
    };
    await this.userModel.update({ userId, update });
  }
}

const mailService = new MailService(userModel);

export { mailService };
