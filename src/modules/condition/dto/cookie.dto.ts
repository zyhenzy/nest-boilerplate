import { ApiProperty } from '@nestjs/swagger';

export class CookieDto {
  @ApiProperty()
  cookie: string;
}
