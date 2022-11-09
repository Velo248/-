import { userService } from '../services/user-service';

// 매일 한번씩 유저들 로그인 기록을 체크해서 마지막 로그인이 몇달 전인 유저는 휴면 계정으로 바꿔줌
function dormantAccountCheckScheduler() {
  setInterval(() => {
    console.log(
      '하루가 지났습니다. 오늘부로 휴면 상태가 되는 계정들 체크중...',
    );
    userService.dormantAccountCheck();
  }, 10000); //원래 여기 값은 하루가 되겠지만 시연을 할때 그렇게 오래 기다릴 수는 없으니 10초마다 체크하는 것으로 설정
}
export { dormantAccountCheckScheduler };
