import { Injectable } from '@nestjs/common';
import { LikeService } from '@user/application/services/like.service';

@Injectable()
export class LikeFeature {
  constructor(private readonly likeService: LikeService) {}

  async like(userId: string, targetUserId: string): Promise<void> {
    return this.likeService.like(userId, targetUserId);
  }

  async unlike(userId: string, targetUserId: string): Promise<void> {
    return this.likeService.unlike(userId, targetUserId);
  }
}
