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

export class UpdateRemarkDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  remark: string;
}

export class UpdateApprenticeDto {
  @ApiProperty({
    type: String,
  })
  id: string;
  @ApiProperty({
    type: Boolean,
  })
  apprentice: boolean;
}
