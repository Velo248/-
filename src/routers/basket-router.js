import { Router } from 'express';
import { basketController } from '../controllers';
import { loginRequired } from '../middlewares';

const basketRouter = Router();

basketRouter.get('/baskets', loginRequired, basketController.getBaskets);

basketRouter.post('/baskets', loginRequired, basketController.addBasket);

basketRouter.patch('/baskets', loginRequired, basketController.updateBasket);

basketRouter.delete('/baskets', loginRequired, basketController.deleteBaskets);
basketRouter.delete(
  '/baskets/:basketId',
  loginRequired,
  basketController.deleteByBasketId,
);

export { basketRouter };
