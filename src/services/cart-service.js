import { cartModel } from '../db';

class CartService {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  //추가
  async addCart(cartInfo) {
    const { userId } = cartInfo;
    const cart = await this.cartModel.findOneByUserId(userId);
    if (cart) {
      throw new Error(`이미 장바구니가 존재하기 때문에 생성할 수 없습니다`);
    }
    const createdNewCart = await this.cartModel.create(cartInfo);
    return createdNewCart;
  }

  //카트목록 목록을 받음
  async getCarts() {
    const carts = await this.cartModel.findAll();
    return carts;
  }

  //현재 로그인된 카트 가져오기
  async getCartByUserId(userId) {
    const cart = await this.cartModel.findOneByUserId(userId);
    if (!cart) {
      throw new Error(`찾는 카트가 없습니다.`);
    }
    return cart;
  }
  //카테고리 정보 수정
  async updateCartByUserId(userId, toUpdate) {
    // 우선 해당 title의 카테고리가 db에 있는지 확인
    let cart = await this.cartModel.findOneByUserId(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!cart) {
      throw new Error('해당 유저의 카트가 없습니다');
    }
    // 업데이트 진행
    //받아온 카트배열
    const { productId, quantity } = toUpdate.orderSheets;
    const cartOrderSheets = cart.orderSheets;
    const newCartOrderSheets = [];
    //변경있을때만 바꾸기
    let flag = true;
    for (const cartOrderSheet of cartOrderSheets) {
      if (cartOrderSheet.productId === productId) {
        flag = false;
        const newOrderSheet = {
          productId,
          quantity: quantity,
        };
        newCartOrderSheets.push(newOrderSheet);
      } else newCartOrderSheets.push(cartOrderSheet);
    }
    // 새로만든 카트와 전 카트가 다를 때(수정필요)
    if (flag) {
      const newOrderSheet = {
        productId,
        quantity: quantity,
      };
      newCartOrderSheets.push(newOrderSheet);
    }
    //같은 번호 없을 때 생성
    const newUpdate = {
      orderSheets: newCartOrderSheets,
    };
    cart = await this.cartModel.updateByUserID({
      userId,
      update: newUpdate,
    });
    return cart;
  }
  //카트아이디로삭제
  async deleteCart(userId, productId) {
    // 우선 해당 title의 카테고리가 db에 있는지 확인
    let cart = await this.cartModel.findOneByUserId(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!cart) {
      throw new Error('해당 유저의 카트가 없습니다');
    }
    // 업데이트 진행
    //받아온 카트배열
    const cartOrderSheets = cart.orderSheets;
    const newCartOrderSheets = [];

    for (const cartOrderSheet of cartOrderSheets) {
      if (cartOrderSheet.productId !== productId) {
        newCartOrderSheets.push(cartOrderSheet);
      }
    }
    if (cartOrderSheets.length === newCartOrderSheets.length) {
      throw new Error('카트에 해당 productId가 없습니다');
    }
    // 새로만든 카트와 전 카트가 다를 때(수정필요)
    //같은 번호 없을 때 생성
    const newUpdate = {
      orderSheets: newCartOrderSheets,
    };
    cart = await this.cartModel.updateByUserID({
      userId,
      update: newUpdate,
    });
    return cart;
  }
  async deleteCartAll(userId) {
    let cart = await this.cartModel.findOneByUserId(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!cart) {
      throw new Error('해당 유저의 카트가 없습니다');
    }
    const newUpdate = {
      orderSheets: [],
    };
    cart = await this.cartModel.updateByUserID({
      userId,
      update: newUpdate,
    });
    return cart;
  }
}

const cartService = new CartService(cartModel);

export { cartService };
