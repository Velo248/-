const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('isAdmin');
  alert('로그아웃 되었습니다');
};

document.addEventListener('DOMContentLoaded', async () => {
  let header = document.querySelector('header');
  let footer = document.querySelector('footer');

  header.innerHTML = `
  <h1>
    <a href="/" class="main_logo">
      <div class="text_blind">간식조아 로고</div>
    </a>
  </h1>
  <div class="nav_wrap">
    <div class="subnav">
      <a href="/login">로그인</a>
      <a href="#" onclick="logout()">로그아웃</a>
      <a href="/register">회원가입</a>
      <a href="/profile">내정보</a>
      <a href="/pay-history">주문·배송</a>
      <a href="/basket">장바구니</a>
    </div>
    <nav>
      <a href="/product">제품</a>
      <a href="/product">이벤트</a>
      <!-- <a href="/product">하나더</a> -->
    </nav>
  </div>
  `;

  footer.innerHTML = `<div class="flex-column-center"> <div class="img_wrap">
        <img src="/public/images/common/logo-g.png" alt="(주) 간식조아" />
      </div>
      <div class="footer_detail">
        <div>
          (주) 간식조아 | 대표: 오히려좋아 | [FE] 박재현, 서아름, 오현석 | [BE]
          조건형, 최충우
        </div>
        <div>
          주소: 서울시 강남구 도산대로 777 (신사동) |
          <a href="#">엘리스 바로가기</a> <a href="#">5팀 깃랩 바로가기</a>
        </div>
        <div>&copy; Elice 5팀 오히려좋아. All rights reserved.</div>
      </div>
    </div>
`;
});
