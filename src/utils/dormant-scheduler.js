import { userService } from '../services/user-service';
import cron from 'node-cron';
function dormantAccountCheckScheduler() {
  cron.schedule('* * * * * *', () => {
    userService.dormantAccountCheck();
  });
}

export { dormantAccountCheckScheduler };
