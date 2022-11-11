import { basketService } from '../services';

class BasketController {
  async getBaskets(req, res, next) {
    try {
      const { currentUserId } = req;
      const baskets = await basketService.getBasketsByUserId(currentUserId);
      res.status(200).json({ baskets });
    } catch (err) {
      next(err);
    }
  }
  async addBasket(req, res, next) {
    try {
      const { currentUserId } = req;
      const { orderSheets } = req.body;
      const baskets = await basketService.addBasket(currentUserId, orderSheets);
      res.status(200).json({ baskets });
    } catch (err) {
      next(err);
    }
  }
  async updateBasket(req, res, next) {
    try {
      const { currentUserId } = req;
      const { orderSheets } = req.body;
      const baskets = await basketService.updateBasket(
        currentUserId,
        orderSheets,
      );
      res.status(200).json({ baskets });
    } catch (err) {
      next(err);
    }
  }
  async deleteBaskets(req, res, next) {
    try {
      const { currentUserId } = req;
      const baskets = await basketService.deleteBaskets(currentUserId);

      res.status(200).json({ baskets });
    } catch (err) {
      next(err);
    }
  }
  async deleteByBasketId(req, res, next) {
    try {
      const { currentUserId } = req;
      const { basketId } = req.params;
      const basket = await basketService.deleteBasket(currentUserId, basketId);

      res.status(200).json({ basket });
    } catch (err) {
      next(err);
    }
  }
}
const basketController = new BasketController();

export { basketController };
