import { userModel } from '../db';
import { sendPasswordMail } from '../utils/send-mail';
import http from 'http';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
class MailService {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async sendPasswordFindMail(email, password, ip) {
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
            await sendPasswordMail(email, password, data);
          });
        },
      )
      .on('error', (err) => {
        next(err);
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
}

const mailService = new MailService(userModel);

export { mailService };
