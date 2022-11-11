import { mailService } from '../services';
import { asyncHandler } from '../utils/async-handler';
const dormantRecovery = asyncHandler(async (req, res, next) => {
  const { email } = req.query;
  if (!email) {
    next();
    return;
  }
  await mailService.recoverDormantAccount(email);
  next();
});

export { dormantRecovery };
