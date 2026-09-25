import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResolveUserMappingDto {
  @ApiProperty({ example: 'ABC123', maxLength: 128 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  id1: string;

  @ApiProperty({ example: 'XYZ456', maxLength: 128 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  id2: string;
}
