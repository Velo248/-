import { cartModel } from '../db';
// import { productModel } from '../db';
// import { orderModel } from '../db';

class CartService {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  //추가
  async addCart(cartInfo) {
    //배열로 들어오면 여기서 처리해야함
    const createdNewCart = await this.cartModel.create(cartInfo);
    return createdNewCart;
  }

  //카트목록 목록을 받음
  async getCarts() {
    const carts = await this.cartModel.findAll();
    return carts;
  }

  //카트 아이디로 찾기
  async getCart(cartId) {
    const cart = await this.cartModel.findOneById(cartId);
    return cart;
  }
  //카테고리 정보 수정
  async updateCart(cartId, toUpdate) {
    // 우선 해당 title의 카테고리가 db에 있는지 확인
    let cart = await this.cartModel.findOneById(cartId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!cart) {
      throw new Error('해당 카테고리가 없습니다. 다시 확인해 주세요.');
    }

    // 업데이트 진행
    cart = await this.cartModel.update({
      cartId,
      update: toUpdate,
    });
    return cart;
  }
  //카트아이디로삭제
  async deleteCart(cartId) {
    const deletedCart = await this.cartModel.deleteById(cartId);
    return deletedCart;
  }
}

const cartService = new CartService(cartModel);

export { cartService };
