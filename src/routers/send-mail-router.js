import { sendMail } from '../utils/send-mail';
import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler';
import http from 'http';
const sendMailRouter = Router();
sendMailRouter.post(
  '/send-mail',
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      res
        .status(400)
        .json('req.body.email undefined, 이메일을 요청 바디에 적어주세요');
      return;
    }
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      req.ip;

    http
      .get(
        `http://ip-api.com/json/${ip}?fields=country,city,regionName`,
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', async () => {
            data = JSON.parse(data);
            await sendMail(email, data);
          });
        },
      )
      .on('error', (err) => {
        next(err);
      });
    res.status(201).json('메일이 발송되었습니다.');
  }),
);

export { sendMailRouter };
