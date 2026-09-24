import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    throw new NotImplementedException();
  }
}
