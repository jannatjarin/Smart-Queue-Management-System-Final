import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from
  './auth.service';

import { RegisterUserDto } from
  './register-user.dto';

import { LoginDto } from
  './login.dto';

import { ForgotPasswordDto } from
  './forgot-password.dto';

import { ResetPasswordDto } from
  './reset-password.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService:
      AuthService,
  ) { }

  @Post('register')
  register(
    @Body()
    dto: RegisterUserDto,
  ) {

    return this.authService
      .register(
        dto,
      );
  }

  @Post('login')
  login(
    @Body()
    dto: LoginDto,
  ) {

    return this.authService
      .login(
        dto,
      );
  }

  @Post('refresh')
  refresh(
    @Body('refresh_token')
    token: string,
  ) {

    return this.authService
      .refresh(
        token,
      );
  }

  @Post('forgot-password')
  forgotPassword(
    @Body()
    dto: ForgotPasswordDto,
  ) {

    return this.authService
      .forgotPassword(
        dto.email,
      );
  }

  @Post('reset-password')
  resetPassword(
    @Body()
    dto: ResetPasswordDto,
  ) {

    return this.authService
      .resetPassword(
        dto.token,
        dto.newPassword,
      );
  }
}