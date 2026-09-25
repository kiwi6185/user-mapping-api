import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { isDuplicateEntry } from '../common/database/is-duplicate-entry';
import { RedisService } from '../redis/redis.service';
import { UserMapping } from './entities/user-mapping.entity';

@Injectable()
export class UserMappingsService {
  constructor(
    @InjectRepository(UserMapping)
    private readonly userMappingsRepository: Repository<UserMapping>,
    private readonly redisService: RedisService,
  ) {}

  async resolve(id1: string, id2: string): Promise<string> {
    const cacheKey = this.cacheKey(id1, id2);
    const cachedUserId = await this.redisService.get(cacheKey);
    if (cachedUserId) {
      return cachedUserId;
    }

    const existing = await this.userMappingsRepository.findOne({
      where: { id1, id2 },
    });
    if (existing) {
      return this.remember(cacheKey, existing.userId);
    }

    const userId = randomUUID();
    try {
      await this.userMappingsRepository.insert({ id1, id2, userId });
    } catch (error) {
      if (!isDuplicateEntry(error)) {
        throw error;
      }

      const saved = await this.userMappingsRepository.findOne({
        where: { id1, id2 },
      });
      if (!saved) {
        throw error;
      }

      return this.remember(cacheKey, saved.userId);
    }

    return this.remember(cacheKey, userId);
  }

  private cacheKey(id1: string, id2: string): string {
    return `user-mapping:${encodeURIComponent(id1)}:${encodeURIComponent(id2)}`;
  }

  private async remember(cacheKey: string, userId: string): Promise<string> {
    await this.redisService.set(cacheKey, userId);
    return userId;
  }
}
