export enum EventExceptionEnum {
  EventNotFound = 'G20001',
  EventTicketNotFound = 'G20002',
  EventTicketNftNotFound = 'G20003',
  HostCannotRegister = 'G20004',
  EventCategoryNotFound = 'G20005',
  EventParticipantNotFound = 'G20006',
  AlreadyRegistered = 'G20007',
}

export enum EventExceptionMessage {
  EventNotFound = '이벤트를 찾을 수 없습니다.',
  EventTicketNotFound = '이벤트 티켓을 찾을 수 없습니다.',
  EventTicketNftNotFound = '이벤트 티켓 NFT를 찾을 수 없습니다.',
  HostCannotRegister = '호스트는 참가할 수 없습니다.',
  EventCategoryNotFound = '이벤트 카테고리를 찾을 수 없습니다.',
  EventParticipantNotFound = '이벤트 참가자를 찾을 수 없습니다.',
  AlreadyRegistered = '이미 등록된 참가자입니다.',
}
