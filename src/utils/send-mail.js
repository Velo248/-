import nodemailer from 'nodemailer';
import fsp from 'fs/promises';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gansikjoa@gmail.com',
    pass: 'yefytrsuzhjbquym',
  },
});

async function renderHtml(template, values) {
  const templateHtml = await fsp.readFile(
    `./src/utils/mail-tamplate/${template}.html`,
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

function sendPasswordMail(email, password, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const { country, regionName, city } = data;
      let regionInfo = '';
      if (city) regionInfo += `${city}, `;
      if (country) regionInfo += `${regionName}, `;
      if (regionName) regionInfo += `${regionName}, `;
      if (!regionInfo) regionInfo = 'unknown ip adress, ';
      const html = await renderHtml('index', {
        email,
        regionInfo,
        password,
      });
      const message = {
        from: 'gansikjoa@gmail.com',
        to: email,
        subject: `간식조아 계정 비밀번호 복구`,
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
      throw error;
    }
  });
}

function sendDormantMail(email, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const { country, regionName, city } = data;
      let regionInfo = '';
      if (city) regionInfo += `${city}, `;
      if (country) regionInfo += `${regionName}, `;
      if (regionName) regionInfo += `${regionName}, `;
      if (!regionInfo) regionInfo = 'unknown ip adress, ';
      const html = await renderHtml('dormant', {
        email,
        regionInfo,
      });
      const message = {
        from: 'gansikjoa@gmail.com',
        to: email,
        subject: `간식조아 휴면 계정 복구`,
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
      throw error;
    }
  });
}
export { sendPasswordMail, sendDormantMail };
