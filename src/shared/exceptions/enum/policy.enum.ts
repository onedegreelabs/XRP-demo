export enum PolicyExceptionEnum {
  PolicyNotFound = 'G09001',
  PolicyIdInvalid = 'G09002',
  PolicyAlreadyExist = 'G09003',
  NotAgreedRequiredPolicy = 'G09004',
}

export enum PolicyExceptionMessage {
  PolicyNotFound = '약관을 찾을 수 없습니다.',
  PolicyIdInvalid = '약관 아이디가 올바르지 않습니다.',
  PolicyAlreadyExist = '이미 존재하는 약관입니다.',
  NotAgreedRequiredPolicy = '필수 약관에 동의해야 합니다.',
}
