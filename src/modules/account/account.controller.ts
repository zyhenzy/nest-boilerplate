import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './entity/account.entity';
import { ApiOperation } from '@nestjs/swagger';

@Controller('accounts')
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
}
