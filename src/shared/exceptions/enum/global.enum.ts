export enum GlobalExceptionEnum {
  NotInNumberFormat = 'G00001',
  MultipartDataIsNotInJsonFormat = 'G00002',
  DatabaseClientRequestError = 'G00005',
  CacheClientRequestError = 'G00006',
  CacheStorageConnectionTimeoutError = 'G00007',
  InvalidRegionFormat = 'G00008',
  AwsS3ClientRequestError = 'G00009',
  MulterRequestError = 'G00010',
  UserEmbeddingSchedulerError = 'G00011',
  PineconeClientRequestError = 'G00012',
  LLMClientRequestError = 'G00013',
  CacheKeyPlaceholderMismatchError = 'G00014', // key와 params의 개수가 일치하지 않는 경우
  CacheKeyPlaceholderIndexError = 'G00015', // 잘못된 placeholder 인덱스 (@1, @2 등이 순서대로 아닌 경우)
  XRPLClientRequest = 'G00016',
  XRPLInSufficientBalance = 'G00017',
}

export enum GlobalExceptionMessage {
  NotInNumberFormat = '숫자 형식이 아닙니다.',
  MultipartDataIsNotInJsonFormat = 'multipart 데이터가 JSON 형식이 아닙니다.',
  DatabaseClientRequestError = '데이터베이스 서버 요청 실패 (백엔드 문의)',
  CacheClientRequestError = '캐시 서버 요청 실패 (백엔드 문의)',
  CacheStorageConnectionTimeoutError = '캐시 저장소 연결 시간 초과 (백엔드 문의)',
  InvalidRegionFormat = '유효하지 않은 지역 형식입니다.',
  AwsS3ClientRequestError = 'AWS S3 서버 요청 실패 (백엔드 문의)',
  MulterRequestError = 'Multer 요청 오류',
  UserEmbeddingSchedulerError = '유저 임베딩 스케줄러 오류',
  PineconeClientRequestError = 'Pinecone 서버 요청 실패 (백엔드 문의)',
  LLMClientRequestError = 'LLM 서버 요청 실패 (백엔드 문의)',
  CacheKeyPlaceholderMismatchError = '키와 params의 개수가 일치하지 않습니다.',
  CacheKeyPlaceholderIndexError = '잘못된 placeholder 인덱스입니다.',
  XRPLClientRequest = 'XRPL 서버 요청 실패 (백엔드 문의)',
  XRPLInSufficientBalance = '잔액이 부족합니다.',
}
