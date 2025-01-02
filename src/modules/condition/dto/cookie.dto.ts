import { ApiProperty } from '@nestjs/swagger';

export class CookieDto {
  @ApiProperty()
  cookie: string;
}

export class ConditionRefreshDto {
  @ApiProperty()
  id: string;
}
