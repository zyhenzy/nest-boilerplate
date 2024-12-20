import { ApiProperty } from '@nestjs/swagger';

export class InsertAccountDto {
  @ApiProperty({
    type: String,
  })
  game_ordersn: string;

  @ApiProperty({
    type: String,
  })
  conditionId: string;
}
