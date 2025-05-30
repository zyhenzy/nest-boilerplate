import { ApiProperty } from '@nestjs/swagger';

export class CookieDto {
  @ApiProperty()
  cookie: string;
}

export class ConditionRefreshDto {
  @ApiProperty()
  id: string;
}

export class InterpretIntermediaryDto {
  @ApiProperty()
  id: string; // conditionID

  @ApiProperty()
  info: string;
}

export class JSONInsertDto {
  @ApiProperty()
  id: string; // conditionID

  @ApiProperty()
  idAndPriceList: IdAndPriceDto[]; // 账号ID和价格数组
}

export class IdAndPriceDto {
  @ApiProperty()
  id: string; // 账号

  @ApiProperty()
  price: number; // 账号价格
}
