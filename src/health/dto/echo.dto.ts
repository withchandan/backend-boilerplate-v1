import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EchoDto {
  @ApiProperty({ description: 'Pass some string' })
  @IsNotEmpty()
  @IsString()
  echo: string;
}
