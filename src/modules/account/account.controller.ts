import { Controller, Post, Body, Get, HttpCode, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entity/account.entity';
import { ApiOperation } from '@nestjs/swagger';

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

  @Get('/findByCondition/:conditionId')
  @HttpCode(200)
  async findByCondition(
    @Param('conditionId') conditionId: string,
  ): Promise<Account[]> {
    return this.accountService.findByCondition(conditionId);
  }
}
