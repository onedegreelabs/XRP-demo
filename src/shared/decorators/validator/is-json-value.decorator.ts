import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false }) // 동기 검증
export class JsonValueValidator implements ValidatorConstraintInterface {
  // JSON 값 검증 로직
  validate(value: any, args: ValidationArguments): boolean {
    return this.isJsonValue(value);
  }

  // 기본 오류 메시지
  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a valid JSON value`;
  }

  // JsonValue 타입 검증 함수
  private isJsonValue(value: any): boolean {
    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return true;
    }

    if (Array.isArray(value)) {
      return value.every((item) => this.isJsonValue(item)); // 배열의 모든 요소가 JsonValue인지 재귀적으로 확인
    }

    if (typeof value === 'object') {
      return Object.values(value).every((val) => this.isJsonValue(val)); // 객체의 모든 값이 JsonValue인지 재귀적으로 확인
    }

    return false; // 그 외 타입은 JsonValue가 아님
  }
}

// 데코레이터 함수
export function IsJsonValue(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isJsonValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: JsonValueValidator, // 위에서 정의한 클래스 사용
    });
  };
}
