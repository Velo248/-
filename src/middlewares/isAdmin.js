function isAdmin(req, res, next) {
  //role이 admin이 아닐 경우 관리자 기능에 접근 제한
  if (req.role != 'admin') {
    console.log(
      `관리자 권한 서비스 사용 요청이 있습니다.하지만, req.role: ${req.role}`,
    );
    res.status(403).json({
      result: 'forbidden-approach',
      reason: '관리자만 접근할 수 있는 기능입니다.',
    });

    return;
  }
  next();
}

export { isAdmin };
