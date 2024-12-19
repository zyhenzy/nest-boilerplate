import { ApiProperty } from '@nestjs/swagger';

export class UpdatePriceDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: Number,
  })
  price: number;
}
