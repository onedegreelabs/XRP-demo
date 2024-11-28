export enum AuthExceptionEnum {
  InvalidTokenAccess = 'G01003',
  FailedToIssueToken = 'G01004',
  UnsupportedProvider = 'G01005',
  InvalidOAuthToken = 'G01006',
  MissingCredentials = 'G01008',
  TokenNotFound = 'G01009',
  JsonWebTokenError = 'G01010',
  TokenExpiredError = 'G01011',
  NotBeforeError = 'G01012',
  InvalidToken = 'G01013',
  InvalidOtp = 'G01014',
  TooManyVerificationRequest = 'G01015',
  BlockedVerificationRequest = 'G01016',
  TooManySendOtpRequest = 'G01017',
  BlockedSendOtpRequest = 'G01018',
  UnauthorizedAccess = 'G01019',
}

export enum AuthExceptionMessage {
  InvalidTokenAccess = '유효하지 않은 토큰 (비정상 접근)',
  FailedToIssueToken = '토큰 서명 실패 (백엔드 문의)',
  UnsupportedProvider = '지원하지 않는 OAuth 제공업체입니다.',
  InvalidOAuthToken = '유효하지 않은 OAuth 토큰입니다.',
  MissingCredentials = '인증 정보가 없습니다.',
  TokenNotFound = '유효하지 않은 토큰 (토큰 없음)',
  JsonWebTokenError = '유효하지 않은 토큰 (잘못된 토큰 형식)',
  TokenExpiredError = '유효하지 않은 토큰 (토큰 만료)',
  NotBeforeError = '유효하지 않은 토큰 (토큰 활성화 전)',
  InvalidToken = '유효하지 않은 토큰 (백엔드 문의)',
  InvalidOtp = '인증번호가 일치하지 않습니다.',
  TooManyVerificationRequest = '인증 요청 횟수 초과',
  BlockedVerificationRequest = '인증 요청이 차단된 유저',
  TooManySendOtpRequest = '인증번호 발송 요청 횟수 초과',
  BlockedSendOtpRequest = '인증번호 발송 요청이 차단된 유저',
  UnauthorizedAccess = '권한이 없습니다.',
}