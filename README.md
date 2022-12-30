# 쇼핑몰 웹 서비스 - 기본 코드

<div>

<a href="https://kdt-sw3-team05.elicecoding.com">
  <img alt="간식조아 메인페이지" src="https://i.ibb.co/7NCW9XV/main.png">
</a>
현재는 지원하지 않습니다.

</div>

<br />

## 1. 서비스 소개

1. 회원가입, 로그인, 회원정보 수정 등 **유저 정보 관련 CRUD**
2. **상품 목록**을 조회 및, **상품 상세 정보**를 조회 가능함.
3. 장바구니에 상품을 추가할 수 있으며, **장바구니에서 CRUD** 작업이 가능함.
4. 장바구니는 기본적으로 프론트 단(localStorage)에 저장되며 로그인된 사용자는 DB와의 연동을 고려함
5. 장바구니에서 주문을 진행하며, **주문 완료 후 조회, 배송지 변경 및 배송 취소**가 가능함
6. **검색**기능을 도입하여 메인 페이지에서 키워드를 입력하여 상품을 검색할 수 있음
7. *관리자*는 회원목록, 카테고리목록, 상품목록, 주문목록을 확인할 수 있음
8. *관리자*는 카테고리 수정, 상품 수정, 주문내용 수정을 할 수 있음
9. 유저는 비밀번호찾기 이용 시 새로운 비밀번호를 이메일로 받음
10. 로그아웃이 오래된 유저는 휴면계정으로 전환되어 접속시 휴면 해제를 위해 이메일로 받은 링크를 통해 해제하여야 함

<br />

### 1-0. 배포된 페이지 및 테스트 계정

### [간식조아](https://kdt-sw3-team05.elicecoding.com/)

| 계정분류 | 아이디          | 비밀번호 |
| -------- | --------------- | -------- |
| 관리자   | admin@test.com  | 1234     |
| 비관리자 | elice1@test.com | 1234     |

### 1-1. API 문서

### https://cooperative-biology-4d7.notion.site/api-960a90e169b44cec97accb4c970af626

<br>

### 1-2. 데모 영상(추후 추가 예정)

<details><summary>사용자 회원가입, 로그인</summary>

![image](https://user-images.githubusercontent.com/91174156/172159634-1e105633-9948-464e-a540-5429200a1353.gif)

</details>

<details><summary>카테고리 추가 및 반영</summary>

추후 관련 영상을 삽입하세요 (하기 2가지 방법 가능)

1. 화면녹화 -> 유튜브 업로드 -> 유튜브 링크 삽입
2. 화면움짤녹화 -> 움짤삽입 (https://www.screentogif.com/ 활용가능)

</details>

<details><summary>상품 추가 및 반영</summary>

추후 관련 영상을 삽입하세요 (하기 2가지 방법 가능)

1. 화면녹화 -> 유튜브 업로드 -> 유튜브 링크 삽입
2. 화면움짤녹화 -> 움짤삽입 (https://www.screentogif.com/ 활용가능)

</details>

<details><summary>장바구니 기능</summary>

추후 관련 영상을 삽입하세요 (하기 2가지 방법 가능)

1. 화면녹화 -> 유튜브 업로드 -> 유튜브 링크 삽입
2. 화면움짤녹화 -> 움짤삽입 (https://www.screentogif.com/ 활용가능)

</details>

<details><summary>주문 기능</summary>

추후 관련 영상을 삽입하세요 (하기 2가지 방법 가능)

1. 화면녹화 -> 유튜브 업로드 -> 유튜브 링크 삽입
2. 화면움짤녹화 -> 움짤삽입 (https://www.screentogif.com/ 활용가능)

</details>

<details><summary>관리자 페이지</summary>

추후 관련 영상을 삽입하세요 (하기 2가지 방법 가능)

1. 화면녹화 -> 유튜브 업로드 -> 유튜브 링크 삽입
2. 화면움짤녹화 -> 움짤삽입 (https://www.screentogif.com/ 활용가능)

</details>

<br />

### 1-3. 페이지 별 화면(추후 추가 예정)

<details>
<summary> 페이지 별 이미지 보기</summary>

|                                              |                                              |
| -------------------------------------------- | -------------------------------------------- |
| ![image](https://i.ibb.co/7NCW9XV/main.png)  | ![image](https://i.ibb.co/PNqZdJv/image.png) |
| 메인 페이지                                  | 회원가입 페이지                              |
| ![image](https://i.ibb.co/2YvVmhV/image.png) | ![image](https://i.ibb.co/xCFmkTH/image.png) |
| 로그인 페이지                                | 상품 목록 페이지                             |
| ![image](https://i.ibb.co/wBN0HnQ/image.png) | ![image](https://i.ibb.co/wYS7Ssx/image.png) |
| 상품 상세 페이지                             | 장바구니 페이지                              |
| ![image](https://i.ibb.co/pyBmrz2/image.png) | ![image](https://i.ibb.co/nQBzdMg/image.png) |
| 내 정보 페이지                               | 내 정보 수정 페이지                          |
| ![image](https://i.ibb.co/FxvLCTn/image.png) | ![image](https://i.ibb.co/ZhNjGpR/image.png) |
| 결제 페이지                                  | 결제내역(주문/배송) 페이지                   |
| ![image](https://i.ibb.co/0q3F2X4/image.png) | ![image](https://i.ibb.co/vL2wrqs/image.png) |
| 결제 내역 상세 페이지                        | 결제(배송)정보 수정 페이지                   |
| ![image](https://i.ibb.co/1dB2dYk/image.png) | ![image](https://i.ibb.co/KK70zNQ/image.png) |
| 관리자 메인 페이지                           | 관리자 카테고리 관리 페이지                  |
| ![image](https://i.ibb.co/TPXs9sy/image.png) | ![image](https://i.ibb.co/b1DQGQh/image.png) |
| 관리자 카테고리 수정 페이지                  | 관리자 상품 관리 페이지                      |
| ![image](https://i.ibb.co/yf0nvFv/image.png) | ![image](https://i.ibb.co/GQbfV0W/image.png) |
| 관리자 상품 추가 페이지                      | 관리자 상품 상세/수정 페이지                 |
| ![image](https://i.ibb.co/WzpHS6Q/image.png) | ![image](https://i.ibb.co/G0xWzpN/image.png) |
| 관리자 유저 관리 페이지                      | 관리자 유저 상세 페이지                      |
| ![image](https://i.ibb.co/DzrMmmc/image.png) | ![image](https://i.ibb.co/qdMZQrD/image.png) |
| 관리자 주문 목록 페이지                      | 관리자 주문 상세/수정 페이지                 |

</details>

<br />

## 2. 기술 스택

<!-- ![image](https://i.ibb.co/N34mXzy/image.png) -->

<br />

### 2-0. 공통

- git/gitlab
- eslint/prettier

### 2-1. 프론트엔드

- **Vanilla javascript**, html, css
- Daum 도로명 주소 api

### 2-2. 백엔드

- **Express** (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose, Mongo Atlas
- cors
- nodemailer
- morgan, winston
- bcrypt
- node-cron

### 2-3. 배포

- GCP(Google Cloud Platform) Compute engine
- pm2, nginx
- Ubuntu
- certbot letsencrypt

## 3. 인프라 구조

![image](https://i.ibb.co/9tGxmx0/image.png)<br />

### 3-1. 폴더 구조

- 프론트: `src/views` 폴더
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

<br />

## 4. 제작자

| 이름   | 담당 업무       |
| ------ | --------------- |
| 오현석 | 팀장/프론트엔드 |
| 박재현 | 프론트엔드      |
| 서아름 | 프론트엔드      |
| 조건형 | 백엔드          |
| 최충우 | 백엔드          |

<br />

## 5. 실행 방법

1. 레포지토리를 클론하고자 하는 디렉토리에서 아래 명령어를 수행

```bash
git clone <레포지토리 주소>
```

2. 클론한 디렉토리에서 아래 명령어를 통해 필요한 module 설치

```bash
npm install
```

3. 필요한 `.env` 설정

```bash
MONGODB_URL=<몽고DB URL>
PORT=5000
JWT_SECERT_KEY=<랜덤 문자열>
```

4. express 앱을 실행

```bash
npm start
```

<br>

## 6. 버전

### 1.0.0

<br>

<!-- ## 7. FAQ

<details><summary>1. 배포된 페이지는 어디에서 확인할 수 있나요?</summary>

  <p>
    https://kdt-sw3-team05.elicecoding.com/ 에서 확인하실 수 있습니다
  </p>

</details> -->

![image](https://i.ibb.co/nn69vtN/image.png)
---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2022 엘리스 Inc. All rights reserved.
