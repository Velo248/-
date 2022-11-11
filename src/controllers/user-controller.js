import is from '@sindresorhus/is';
import { userService } from '../services';
import { logger } from '../utils/logger';

class UserController {
  async register(req, res, next) {
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
  async login(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }

      const email = req.body.email;
      const password = req.body.password;

      const userToken = await userService.getUserToken({ email, password });

      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.info(ip + ' login');

      res.status(200).json(userToken);
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const userId = req.currentUserId;
      const user = await userService.setLogoutTime(userId);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
  async getUsersAdmin(req, res, next) {
    try {
      const users = await userService.getUsers();

      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
  async getUsers(req, res, next) {
    try {
      const { currentUserId } = req;
      if (!currentUserId) {
        throw new Error('error : 로그인된 상태여야 이용할 수 있습니다!');
      }
      const user = await userService.getUser(currentUserId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
  async getUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUser(userId);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
  async getOrders(req, res, next) {
    try {
      const { userId } = req.params;
      const orders = await userService.getOrdersByUser(userId);
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }
  async setByUserId(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }

      const userId = req.params.userId;

      const fullName = req.body.fullName;
      const password = req.body.password;
      const address = req.body.address;
      const phoneNumber = req.body.phoneNumber;
      const role = req.body.role;

      const toUpdate = {
        ...(fullName && { fullName }),
        ...(password && { password }),
        ...(address && { address }),
        ...(phoneNumber && { phoneNumber }),
        ...(role && { role }),
      };
      const updatedUserInfo = await userService.setUserByAdmin(
        userId,
        toUpdate,
      );

      res.status(200).json(updatedUserInfo);
    } catch (err) {
      next(err);
    }
  }
  async setUsers(req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          'headers의 Content-Type을 application/json으로 설정해주세요',
        );
      }

      const { currentUserId } = req;
      const { fullName, password, address, phoneNumber, currentPassword } =
        req.body;

      if (!currentPassword) {
        throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
      }

      const userInfoRequired = { userId: currentUserId, currentPassword };

      const toUpdate = {
        ...(fullName && { fullName }),
        ...(password && { password }),
        ...(address && { address }),
        ...(phoneNumber && { phoneNumber }),
      };

      const updatedUserInfo = await userService.setUser(
        userInfoRequired,
        toUpdate,
      );

      res.status(200).json(updatedUserInfo);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const { currentUserId } = req;
      const deletedResult = await userService.deleteUser(currentUserId);
      res.status(200).json(deletedResult);
    } catch (err) {
      next(err);
    }
  }
  async deleteByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const deletedResult = await userService.deleteUser(userId);
      res.status(200).json(deletedResult);
    } catch (err) {
      next(err);
    }
  }
}
const userController = new UserController();

export { userController };
