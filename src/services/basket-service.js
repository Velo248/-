import { basketModel, productModel, userModel } from '../db';

class BasketService {
  constructor(basketModel, productModel, userModel) {
    this.basketModel = basketModel;
    this.userModel = userModel;
    this.productModel = productModel;
  }

  async getBasketByProductId(id) {
    const query = { productId: id };
    const basket = await this.basketModel.findOne(query);
    return basket;
  }
  async getBasketsByUserId(id) {
    const query = { userId: id };
    const baskets = await this.basketModel.find(query);
    return baskets;
  }

  async addBasket(currentUserId, orderSheets) {
    //orderSheets :req.body{productId:string,quantity:number}
    //유저정보검색
    const userQuery = { _id: currentUserId };
    const user = await this.userModel.findOne(userQuery);
    if (!user) {
      throw new Error('해당하는 유저정보가 없습니다.');
    }
    //유저아이디에서 카트있는지 확인
    //req.body 부터확인
    for (const orderSheet of orderSheets) {
      //유저카트가져옴
      const { productId, quantity } = orderSheet;
      const isProduct = await this.productModel.findById(productId);
      if (!isProduct) {
        throw new Error('해당id의 상품이 존재하지 않습니다');
      }

      const basketQuery = { userId: currentUserId, productId: productId };
      const basket = await this.basketModel.findOne(basketQuery);
      if (basket) {
        //존재할땐 update
        const id = { productId };
        const updateBasketBody = { userId: currentUserId, quantity };
        await this.basketModel.update(id, updateBasketBody);
      } else {
        // 없을땐 create
        const newBasket = { userId: currentUserId, productId, quantity };
        await this.basketModel.create(newBasket);
      }
    }
    //일단 전체문서반환
    const basketQuery = { userId: currentUserId };
    return await this.basketModel.find(basketQuery);
  }
  async updateBasket(currentUserId, orderSheets) {
    //orderSheets :req.body{productId:string,quantity:number}
    //유저정보검색
    const userQuery = { _id: currentUserId };
    const user = await this.userModel.findOne(userQuery);
    if (!user) {
      throw new Error('해당하는 유저정보가 없습니다.');
    }
    //유저아이디에서 카트있는지 확인
    //req.body 부터확인
    for (const orderSheet of orderSheets) {
      //유저카트가져옴
      const { productId, quantity } = orderSheet;
      const isProduct = await this.productModel.findById(productId);
      if (!isProduct) {
        throw new Error('해당id의 상품이 존재하지 않습니다');
      }

      const basketQuery = { userId: currentUserId, productId: productId };
      const basket = await this.basketModel.findOne(basketQuery);
      if (basket) {
        //존재할땐 update
        const id = { productId };
        const updateBasketBody = { userId: currentUserId, quantity };
        await this.basketModel.update(id, updateBasketBody);
      } else {
        // 없을땐 create
        const newBasket = { userId: currentUserId, productId, quantity };
        await this.basketModel.create(newBasket);
      }
    }
    //일단 전체문서반환
    const basketQuery = { userId: currentUserId };
    return await this.basketModel.find(basketQuery);
  }
  async deleteBasket(currentUserId, basketId) {
    const userQuery = { _id: currentUserId };
    const user = await this.userModel.findOne(userQuery);
    if (!user) {
      throw new Error('해당하는 유저정보가 없습니다.');
    }
    //유저카트가져옴
    const basketQuery = { userId: currentUserId, _id: basketId };
    return await this.basketModel.deleteOne(basketQuery);
  }
  async deleteBaskets(currentUserId) {
    const userQuery = { _id: currentUserId };
    const user = await this.userModel.findOne(userQuery);
    if (!user) {
      throw new Error('해당하는 유저정보가 없습니다.');
    }
    //유저카트가져옴

    const deleteFilter = { userId: currentUserId };
    return await this.basketModel.deleteAll(deleteFilter);
  }
}

const basketService = new BasketService(basketModel, productModel, userModel);

export { basketService };
