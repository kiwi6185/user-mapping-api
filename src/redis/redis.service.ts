import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private readonly ttlSeconds: number;
  private connected = true;

  constructor(configService: ConfigService) {
    const password = configService.get<string>('REDIS_PASSWORD');

    this.ttlSeconds = configService.getOrThrow<number>('REDIS_TTL_SECONDS');
    this.client = new Redis({
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
      password: password || undefined,
      lazyConnect: true,
      connectTimeout: 1000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    this.client.on('error', (error: Error) => {
      if (!this.connected) {
        return;
      }

      this.connected = false;
      this.logger.warn(`Redis unavailable: ${error.message}`);
    });
    this.client.on('ready', () => {
      this.connected = true;
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await this.client.set(key, value, 'EX', this.ttlSeconds);
    } catch {
      return;
    }
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}
