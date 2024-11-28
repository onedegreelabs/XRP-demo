import { ObjectForItemPositioning } from '@util/item-positioning/item-positioning.type';

export class ItemPositioning {
  private readonly insertItems: ObjectForItemPositioning[];
  private readonly MAX_BIGINT: bigint;
  private readonly MAX_ITEMS: number;
  private MIN_POSITION: bigint;
  private MAX_POSITION: bigint;

  constructor(insertItems: ObjectForItemPositioning[]) {
    this.MAX_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
    this.MAX_ITEMS = insertItems.length;
    this.insertItems = insertItems;
  }

  // 아이템들의 위치를 계산하는 메서드
  public calculateItemsPosition(): ObjectForItemPositioning[] {
    // 아이템이 하나만 있을 경우, 그 위치를 중앙값으로 설정
    if (this.MAX_ITEMS === 1) {
      this.insertItems[0].position =
        this.insertItems[0].position ?? BigInt(this.MAX_BIGINT) / BigInt(2);
      return this.insertItems;
    }

    // 기존에 정의된 위치를 가진 아이템들의 위치 가져오기
    this.setMinMaxPosition();

    // 위치를 균등하게 재배치할지 여부 확인
    const range = this.MAX_POSITION - this.MIN_POSITION;
    if (this.shouldReallocateEvenly(range)) {
      return this.reallocatePositionsEvenly(this.insertItems);
    } else {
      // 기존 위치를 기준으로 재배치
      return this.insertItems.map((insertItem, index) => {
        insertItem.position = this.calculateNewPositionForItem(
          this.insertItems,
          index,
        );
        return insertItem;
      });
    }
  }

  // 아이템들의 위치에서 최소값과 최대값을 구하는 메서드 (static)
  private setMinMaxPosition() {
    const positions = this.insertItems
      .filter((item) => item.position)
      .map((item) => BigInt(item.position));

    let minPosition = positions[0];
    let maxPosition = positions[0];

    positions.forEach((position) => {
      if (position < minPosition) {
        minPosition = position;
      }
      if (position > maxPosition) {
        maxPosition = position;
      }
    });

    this.MIN_POSITION = minPosition;
    this.MAX_POSITION = maxPosition;
  }

  // 위치 범위가 충분히 작아서 위치를 균등하게 재배치할 수 있는지 확인하는 메서드 (static)
  private shouldReallocateEvenly(range: bigint): boolean {
    const threshold = BigInt(this.MAX_BIGINT) / BigInt(this.MAX_ITEMS * 2);
    return range < threshold;
  }

  // 아이템들의 위치를 균등하게 재배치하는 메서드 (static)
  private reallocatePositionsEvenly(
    insertItems: ObjectForItemPositioning[],
  ): ObjectForItemPositioning[] {
    const spacing = BigInt(this.MAX_BIGINT) / BigInt(insertItems.length + 1);

    return insertItems.map((insertItem, index) => {
      insertItem.position = BigInt(index + 1) * spacing;
      return insertItem;
    });
  }

  // 이웃 아이템을 기준으로 새로운 위치를 계산하는 메서드 (static)
  private calculateNewPositionForItem(
    insertItems: ObjectForItemPositioning[],
    index: number,
  ): bigint {
    const isFirst = index === 0;
    const isLast = index === insertItems.length - 1;
    const beforeItem = isFirst ? null : insertItems[index - 1];
    const afterItem = isLast ? null : insertItems[index + 1];

    let newPosition: bigint;

    if (!beforeItem) {
      // 시작 위치에 추가할 경우
      newPosition = afterItem.position
        ? BigInt(afterItem.position) / BigInt(2)
        : BigInt(this.MAX_BIGINT) / BigInt(2);
    } else if (!afterItem) {
      // 끝 위치에 추가할 경우
      newPosition = beforeItem.position
        ? BigInt(beforeItem.position + this.MAX_BIGINT) / BigInt(2)
        : BigInt(this.MAX_BIGINT) / BigInt(2);
    } else if (beforeItem && afterItem) {
      // 중간에 추가할 경우
      newPosition =
        BigInt(beforeItem.position + afterItem.position) / BigInt(2);
    } else {
      throw new Error('Invalid target position or missing parameters');
    }

    return newPosition;
  }
}
