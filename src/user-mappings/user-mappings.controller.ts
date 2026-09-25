import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResolveUserMappingDto } from './dto/resolve-user-mapping.dto';
import { UserMappingResponseDto } from './dto/user-mapping-response.dto';
import { UserMappingsService } from './user-mappings.service';

@ApiTags('user-mappings')
@Controller('user-mappings')
export class UserMappingsController {
  constructor(private readonly userMappingsService: UserMappingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve the userID for an id1 and id2 pair' })
  @ApiOkResponse({ type: UserMappingResponseDto })
  @ApiBadRequestResponse({ description: 'id1 or id2 is missing or invalid' })
  async resolve(@Body() dto: ResolveUserMappingDto): Promise<UserMappingResponseDto> {
    const userID = await this.userMappingsService.resolve(dto.id1, dto.id2);
    return { userID };
  }
}
