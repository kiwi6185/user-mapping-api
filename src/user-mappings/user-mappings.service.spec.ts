import { QueryFailedError, Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { UserMapping } from './entities/user-mapping.entity';
import { UserMappingsService } from './user-mappings.service';

const id1 = 'ABC123';
const id2 = 'XYZ456';
const cacheKey = `user-mapping:${id1}:${id2}`;
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function stored(userId: string): UserMapping {
  return { userId } as UserMapping;
}

function duplicateKeyError(): QueryFailedError {
  return new QueryFailedError(
    'INSERT',
    [],
    Object.assign(new Error('Duplicate entry'), {
      errno: 1062,
      code: 'ER_DUP_ENTRY',
    }),
  );
}

describe('UserMappingsService', () => {
  const repository = {
    findOne: jest.fn(),
    insert: jest.fn(),
  };
  const redis = {
    get: jest.fn(),
    set: jest.fn(),
  };
  const service = new UserMappingsService(
    repository as unknown as Repository<UserMapping>,
    redis as unknown as RedisService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    redis.get.mockResolvedValue(null);
    redis.set.mockResolvedValue(undefined);
  });

  it('creates a UUID when the pair does not exist', async () => {
    repository.findOne.mockResolvedValue(null);
    repository.insert.mockResolvedValue(undefined);

    const userId = await service.resolve(id1, id2);

    expect(userId).toMatch(uuidV4);
    expect(repository.insert).toHaveBeenCalledWith({ id1, id2, userId });
    expect(redis.set).toHaveBeenCalledWith(cacheKey, userId);
  });

  it('returns the stored userID when Redis misses', async () => {
    repository.findOne.mockResolvedValue(stored('existing-user-id'));

    await expect(service.resolve(id1, id2)).resolves.toBe('existing-user-id');
    expect(repository.insert).not.toHaveBeenCalled();
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id1, id2 } });
  });

  it('returns the cached userID without querying MySQL', async () => {
    redis.get.mockResolvedValue('cached-user-id');

    await expect(service.resolve(id1, id2)).resolves.toBe('cached-user-id');
    expect(repository.findOne).not.toHaveBeenCalled();
  });

  it('returns the saved userID when insert hits a duplicate key', async () => {
    repository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(stored('saved-user-id'));
    repository.insert.mockRejectedValue(duplicateKeyError());

    await expect(service.resolve(id1, id2)).resolves.toBe('saved-user-id');
    expect(redis.set).toHaveBeenCalledWith(cacheKey, 'saved-user-id');
  });

  it('rethrows database errors that are not duplicate keys', async () => {
    const failure = new Error('connection lost');
    repository.findOne.mockResolvedValue(null);
    repository.insert.mockRejectedValue(failure);

    await expect(service.resolve(id1, id2)).rejects.toBe(failure);
  });
});
