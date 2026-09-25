import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResolveUserMappingDto } from './resolve-user-mapping.dto';

describe('ResolveUserMappingDto', () => {
  const pipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  function validate(body: object): Promise<ResolveUserMappingDto> {
    return pipe.transform(body, {
      type: 'body',
      metatype: ResolveUserMappingDto,
    });
  }

  it('accepts id1 and id2', async () => {
    await expect(validate({ id1: 'ABC123', id2: 'XYZ456' })).resolves.toEqual({
      id1: 'ABC123',
      id2: 'XYZ456',
    });
  });

  it.each([
    [{ id2: 'XYZ456' }],
    [{ id1: 'ABC123', id2: '' }],
    [{ id1: 'ABC123', id2: 'XYZ456', extra: 'nope' }],
  ])('rejects %j', async (body) => {
    await expect(validate(body)).rejects.toBeInstanceOf(BadRequestException);
  });
});
