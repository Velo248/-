import { searchService } from '../services';

class SearchController {
  async getProducts(req, res, next) {
    try {
      const { keyword } = req.query;

      if (keyword) {
        const products = await searchService.searchProducts(keyword);
        res.status(200).json(products);
      } else {
        res.status(421).json({
          err: 'Misdirected Request',
          reason: 'querystring should include search',
        });
      }
    } catch (err) {
      next(err);
    }
  }
}
const searchController = new SearchController();

export { searchController };
