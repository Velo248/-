import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gansikjoa@gmail.com',
    pass: 'yefytrsuzhjbquym',
  },
}); // nodemailer 로 gmail transport 생성하기

module.exports = (to) =>
  new Promise((resolve, reject) => {
    const message = {
      // userTo 변수에는 이메일을 받는 사람의 이메일 주소를 적어주세요.
      from: 'gansikjoa@gmail.com',
      to: to,
      subject: '간식조아 계정 복구',
      html: `<div
      style='
      width: 80%; 
      height: 50%;
      marginRight: 10%;
      padding: 20px;
      box-shadow: 1px 1px 3px 0px #999;
      '>
      <h3>비밀번호 복구 코드입니다.</h3>
      <br/> <h2 style='text-align: center; '>Verification Code: 1234</h2>
      <br/>위 코드를 입력해 새 비밀번호를 설정하세요.
      <br/>
      <br/>
      <br/>
      <br/></div>`,
    };

    transport.sendMail(message, (err, info) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(info);
    });
  });
