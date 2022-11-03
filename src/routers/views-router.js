import express from 'express';
import path from 'path';

const viewsRouter = express.Router();

// 페이지별로 html, css, js 파일들을 라우팅함
// 아래와 같이 하면, http://localhost:5000/ 에서는 views/home/home.html 파일을,
// http://localhost:5000/register 에서는 views/register/register.html 파일을 화면에 띄움
viewsRouter.use('/', serveStatic('main'));
viewsRouter.use('/admin-category-list', serveStatic('admin-category-list'));
viewsRouter.use('/admin-category-edit', serveStatic('admin-category-edit'));
viewsRouter.use('/admin-main', serveStatic('admin-main'));
viewsRouter.use('/admin-order-detail', serveStatic('admin-order-detail'));
viewsRouter.use('/admin-order-edit', serveStatic('admin-order-edit'));
viewsRouter.use('/admin-order-list', serveStatic('admin-order-list'));
viewsRouter.use('/admin-product-adder', serveStatic('admin-product-adder'));
viewsRouter.use('/admin-product-detail', serveStatic('admin-product-detail'));
viewsRouter.use('/admin-product-list', serveStatic('admin-product-list'));
viewsRouter.use('/admin-user-detail', serveStatic('admin-user-detail'));
viewsRouter.use('/admin-user-list', serveStatic('admin-user-list'));
viewsRouter.use('/admin-user-order', serveStatic('admin-user-order'));
viewsRouter.use('/basket', serveStatic('basket'));
viewsRouter.use('/categories', serveStatic('categories'));
viewsRouter.use('/login', serveStatic('login'));
viewsRouter.use('/order-change', serveStatic('order-change'));
viewsRouter.use('/orders', serveStatic('orders'));
viewsRouter.use('/pay-history', serveStatic('pay-history'));
viewsRouter.use('/payments', serveStatic('payments'));
viewsRouter.use('/products', serveStatic('products'));
viewsRouter.use('/profile', serveStatic('profile'));
viewsRouter.use('/profile-edit', serveStatic('profile-edit'));
viewsRouter.use('/register', serveStatic('register'));

// views 폴더의 최상단 파일인 rabbit.png, api.js 등을 쓸 수 있게 함
viewsRouter.use('/', serveStatic(''));

// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/pages/${resource}`);
  const option = { index: 'index.html' };

  // express.static 은 express 가 기본으로 제공하는 함수임
  return express.static(resourcePath, option);
}

export { viewsRouter };
