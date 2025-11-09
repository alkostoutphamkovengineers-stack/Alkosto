import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { ValidateUserEmailDto } from './dto/validateUserEmail.dto';
import { RegisterUserDto } from './dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('validate-user-email')
  public async validateUserEmail(@Query() query: ValidateUserEmailDto) {
    return this.service.findOneUser({ email: query.email });
  }

  @Post('register')
  public async registerUser(@Body() body: RegisterUserDto) {
    return this.service.register(body);
  }
}
