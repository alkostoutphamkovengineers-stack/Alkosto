import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateOtpCodeDto } from './dto/generate-opt-code.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginPasswordDto } from './dto/login-password.dto';
import { ValidOptCodeDto } from './dto/valid-opt-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('valid-opt-code')
  validOptCode(@Query() query: ValidOptCodeDto) {
    return this.service.validOptCode(query.optCode, query.email, query.method);
  }

  @Post('generate-opt-code')
  generateOptCode(@Body() body: GenerateOtpCodeDto) {
    return this.service.generateOptCode(
      body.method,
      body.email,
      body.phoneNumber,
    );
  }

  @Post('change-password')
  changePassword(@Body() body: ChangePasswordDto) {
    return this.service.changePassword(body.email, body.newPassword);
  }

  @Post('login-password')
  loginPassword(@Body() body: LoginPasswordDto) {
    return this.service.loginPassword(body.email, body.password);
  }
}
