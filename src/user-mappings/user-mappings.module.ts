import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';
import { UserMapping } from './entities/user-mapping.entity';
import { UserMappingsController } from './user-mappings.controller';
import { UserMappingsService } from './user-mappings.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserMapping]), RedisModule],
  controllers: [UserMappingsController],
  providers: [UserMappingsService],
})
export class UserMappingsModule {}
