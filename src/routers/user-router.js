import { Router } from 'express';
import is from '@sindresorhus/is';
import { isAdmin, loginRequired } from '../middlewares';
import { userService } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { logger } from '../utils/logger';

const userRouter = Router();

userRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
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
  }),
);

userRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요',
      );
    }

    const email = req.body.email;
    const password = req.body.password;

    const userToken = await userService.getUserToken({ email, password });
    logger.info('login');
    logger.error('login-error');
    res.status(200).json(userToken);
  }),
);

userRouter.post(
  '/logout',
  loginRequired,
  asyncHandler(async (req, res) => {
    const userId = req.currentUserId;
    const user = await userService.setLogoutTime(userId);
    res.status(201).json(user);
  }),
);

userRouter.get(
  '/admin/users',
  loginRequired,
  isAdmin,
  asyncHandler(async (req, res) => {
    const users = await userService.getUsers();

    res.status(200).json(users);
  }),
);

userRouter.get(
  '/users',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    if (!currentUserId) {
      throw new Error('error : 로그인된 상태여야 이용할 수 있습니다!');
    }
    const user = await userService.getUser(currentUserId);
    res.status(200).json(user);
  }),
);

userRouter.get(
  '/admin/users/:userId',
  loginRequired,
  asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const user = await userService.getUser(userId);
    res.status(200).json(user);
  }),
);
userRouter.get(
  '/admin/users/:userId/orders',
  loginRequired,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const orders = await userService.getOrdersByUser(userId);
    res.status(200).json(orders);
  }),
);

userRouter.patch(
  '/admin/users/:userId',
  loginRequired,
  isAdmin,
  asyncHandler(async (req, res) => {
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
    const updatedUserInfo = await userService.setUserByAdmin(userId, toUpdate);

    res.status(200).json(updatedUserInfo);
  }),
);

userRouter.patch(
  '/users',
  loginRequired,
  asyncHandler(async (req, res) => {
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
  }),
);

userRouter.delete(
  '/users',
  loginRequired,
  asyncHandler(async (req, res) => {
    const { currentUserId } = req;
    const deletedResult = await userService.deleteUser(currentUserId);
    res.status(200).json(deletedResult);
  }),
);

userRouter.delete(
  '/admin/users/:userId',
  loginRequired,
  isAdmin,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const deletedResult = await userService.deleteUser(userId);
    res.status(200).json(deletedResult);
  }),
);
export { userRouter };
