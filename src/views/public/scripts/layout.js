import userService from './userService';
const logout = () => {
  userService.logout();
  localStorage.clear();
  sessionStorage.clear();
  alert('로그아웃 되었습니다');
  headerMaker();
  location.href = '/';
};

const clickEventMap = {
  logout_btn: logout,
};

const headerMaker = () => {
  let header = document.querySelector('header');

  if (sessionStorage.getItem('token')) {
    //로그인 상태
    header.innerHTML = `
    <h1>
      <a href="/" class="main_logo">
        <div class="text_blind">간식조아 로고</div>
      </a>
    </h1>
    <div class="nav_wrap">
      <div class="subnav">
        <a href="#" class='logout_btn'>로그아웃</a>
        <a href="/profile">내정보</a>
        <a href="/pay-history">주문·배송</a>
        <a href="/basket">장바구니</a>
      </div>
      <nav>
        <a href="/product">제품</a>
        <a href="#" onclick="alert('개발 예정입니다')">이벤트</a>
      </nav>
    </div>
    `;
  } else {
    //비로그인 상태
    header.innerHTML = `
    <h1>
      <a href="/" class="main_logo">
        <div class="text_blind">간식조아 로고</div>
      </a>
    </h1>
    <div class="nav_wrap">
      <div class="subnav">
        <a href="/login">로그인</a>
        <a href="/register">회원가입</a>
        <a href="/basket">장바구니</a>
      </div>
      <nav>
        <a href="/product">제품</a>
        <a href="#" onclick="alert('개발 예정입니다')">이벤트</a>
      </nav>
    </div>
    `;
  }

  header.addEventListener('click', (e) => {
    if (!clickEventMap[e.target.className]) return;
    clickEventMap[e.target.className]();
  });
};

const footerMaker = () => {
  let footer = document.querySelector('footer');

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
    <a href="https://elice.training/" target="_blank">엘리스 바로가기</a> | <a href="https://kdt-gitlab.elice.io/sw_track/class_03/web_project/team5/team5-commerce" target="_blank">5팀 깃랩 바로가기</a>
  </div>
  <div>&copy; Elice 5팀 오히려좋아. All rights reserved.</div>
</div>
</div>
`;
};

document.addEventListener('DOMContentLoaded', () => {
  headerMaker();
  footerMaker();
});
