import { Router } from 'express';
import { isAdmin, loginRequired } from '../middlewares';
import { userController } from '../controllers';
const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.post('/logout', loginRequired, userController.logout);

userRouter.get(
  '/admin/users',
  loginRequired,
  isAdmin,
  userController.getUsersAdmin,
);

userRouter.get('/users', loginRequired, userController.getUsers);
userRouter.get('/admin/users/:userId', loginRequired, userController.getUser);
userRouter.get(
  '/admin/users/:userId/orders',
  loginRequired,
  isAdmin,
  userController.getOrders,
);

userRouter.patch(
  '/admin/users/:userId',
  loginRequired,
  isAdmin,
  userController.setByUserId,
);

userRouter.patch('/users', loginRequired, userController.setUsers);

userRouter.delete('/users', loginRequired, userController.delete);

userRouter.delete(
  '/admin/users/:userId',
  loginRequired,
  isAdmin,
  userController.deleteByUserId,
);
export { userRouter };
