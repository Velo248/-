import express from 'express';
import path from 'path';
import { dormantRecovery } from '../middlewares/dormant-recovery';
const viewsRouter = express.Router();

viewsRouter.use('/', serveStatic('main'));
viewsRouter.use('/admin', serveStatic('admin-main'));
viewsRouter.use('/admin/category/list', serveStatic('admin-category-list'));
viewsRouter.use('/admin/category/edit', serveStatic('admin-category-edit'));
viewsRouter.use('/admin/order/detail', serveStatic('admin-order-detail'));
viewsRouter.use('/admin/order/list', serveStatic('admin-order-list'));
viewsRouter.use('/admin/product/adder', serveStatic('admin-product-adder'));
viewsRouter.use('/admin/product/detail', serveStatic('admin-product-detail'));
viewsRouter.use('/admin/product/list', serveStatic('admin-product-list'));
viewsRouter.use('/admin/user/detail', serveStatic('admin-user-detail'));
viewsRouter.use('/admin/user/list', serveStatic('admin-user-list'));
viewsRouter.use('/basket', serveStatic('basket'));
viewsRouter.use('/product', serveStatic('product'));
viewsRouter.use('/login', dormantRecovery, serveStatic('login'));
viewsRouter.use('/order-change/:orderId', serveStatic('order-change'));
viewsRouter.use('/orders/:orderId', serveStatic('order-detail'));
viewsRouter.use('/pay-history', serveStatic('pay-history'));
viewsRouter.use('/payments', serveStatic('payments'));
viewsRouter.use('/product-detail/:productId', serveStatic('product-detail'));
viewsRouter.use('/profile', serveStatic('profile'));
viewsRouter.use('/profile-edit', serveStatic('profile-edit'));
viewsRouter.use('/password-edit', serveStatic('password-edit'));
viewsRouter.use('/register', serveStatic('register'));
viewsRouter.use('/search', serveStatic('search'));

viewsRouter.use(
  '/public',
  express.static(path.join(__dirname, '../views/public')),
);

function serveStatic(resource) {
  if (resource.split('-')[0] === 'admin') {
    const resourcePath = path.join(
      __dirname,
      `../views/pages/admin/${resource}`,
    );
    const option = { index: 'index.html' };

    return express.static(resourcePath, option);
  }
  const resourcePath = path.join(__dirname, `../views/pages/${resource}`);
  const option = { index: 'index.html' };

  return express.static(resourcePath, option);
}

export { viewsRouter };
