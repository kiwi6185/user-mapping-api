import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ResolveUserMappingDto } from './dto/resolve-user-mapping.dto';
import { UserMappingResponseDto } from './dto/user-mapping-response.dto';
import { UserMappingsService } from './user-mappings.service';

@Controller('user-mappings')
export class UserMappingsController {
  constructor(private readonly userMappingsService: UserMappingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async resolve(@Body() dto: ResolveUserMappingDto): Promise<UserMappingResponseDto> {
    const userID = await this.userMappingsService.resolve(dto.id1, dto.id2);
    return { userID };
  }
}
