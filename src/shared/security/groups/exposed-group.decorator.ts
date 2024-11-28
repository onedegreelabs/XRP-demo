import { applyDecorators, SerializeOptions } from '@nestjs/common';
import { EXPOSED_GROUPS } from '@shared/security/groups/exposed-group.enum';

// Expose 조건부 직렬화 데코레이터를 활용하여 해당 그룹에 속한 필드만 노출시키도록 하는 데코레이터
// 주로 컨트롤러에서 적용되며, 해당 메서드에 접근할 수 있는 권한을 가진 사용자에게만 노출되는 필드를 설정할 때 사용
export function ExposedGroup(groups: EXPOSED_GROUPS[]) {
  return applyDecorators(SerializeOptions({ groups }));
}
