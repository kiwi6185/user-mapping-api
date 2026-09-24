import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResolveUserMappingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  id1: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  id2: string;
}
