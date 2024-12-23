import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InsertAccountDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  game_ordersn: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  conditionId: string;
}
