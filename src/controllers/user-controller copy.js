import { userService } from '../services';

class userController {
  async addUser(req, res, next) {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    const role = req.body.role;
    const newUser = await userService.addUser({
      fullName,
      email,
      password,
      phoneNumber,
      address,
      role,
    });

    res.status(201).json(newUser);
    try {
    } catch (err) {
      next(err);
    }
  }
  async temp(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }
}
const userController = new userController();

export * from './order-controller';
