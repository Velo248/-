import nodemailer from 'nodemailer';
import fsp from 'fs/promises';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gansikjoa@gmail.com',
    pass: 'yefytrsuzhjbquym',
  },
}); // nodemailer 로 gmail transport 생성하기

async function renderHtml(values) {
  const templateHtml = await fsp.readFile(
    './src/utils/mail-tamplate/index.html',
    {
      encoding: 'utf-8',
    },
  );
  const keys = Object.keys(values);

  const keyAndTemplateVariableTuples = keys.map((key) => {
    return [key, `{{${key}}}`];
  });
  let result = templateHtml;
  for (const keyAndTemplateVariable of keyAndTemplateVariableTuples) {
    const [key, templateVariable] = keyAndTemplateVariable;
    result = result.replaceAll(templateVariable, values[key]);
  }
  return result;
}

module.exports = (to) =>
  new Promise(async (resolve, reject) => {
    try {
      const html = await renderHtml({
        email: to,
      });
      const message = {
        // userTo 변수에는 이메일을 받는 사람의 이메일 주소를 적어주세요.
        from: 'gansikjoa@gmail.com',
        to: to,
        subject: '간식조아 계정 복구',
        html,
      };

      transport.sendMail(message, (err, info) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(info);
      });
    } catch (error) {
      console.log(error);
    }
  });
