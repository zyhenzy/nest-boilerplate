import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entity/account.entity';
import { ApiOperation } from '@nestjs/swagger';
import { UpdatePriceDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary: 'Create a new account',
    description: 'Create a new account',
  })
  @Post()
  async create(@Body() account: Account): Promise<Account> {
    return this.accountService.create(account);
  }

  @ApiOperation({
    summary: '根据条件检索账号',
    description: '根据条件检索账号',
  })
  @Get('/findByCondition/:conditionId')
  async findByCondition(
    @Param('conditionId') conditionId: string,
  ): Promise<Account[]> {
    return this.accountService.findByCondition(conditionId);
  }

  @ApiOperation({
    summary: '修改中介价格',
    description: '修改中介价格',
  })
  @Post('/updatePrice')
  updatePrice(@Body() updatePrice: UpdatePriceDto) {
    return this.accountService.updatePrice(updatePrice.id, updatePrice.price);
  }
}
