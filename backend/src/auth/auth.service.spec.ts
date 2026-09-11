import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcryptjs';

import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';

import { NotificationsService } from
  'src/notifications/notifications.service';

import { NotificationType } from
  'src/common/enums/notification-type.enum';

import { Role } from
  'src/common/enums/role.enum';

import { RegisterUserDto } from
  './register-user.dto';

import { LoginDto } from
  './login.dto';

interface ResetTokenPayload {
  id: number;
  purpose: string;
  version: number;
}

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService:
      UsersService,

    private readonly jwtService:
      JwtService,

    private readonly configService:
      ConfigService,

    private readonly mailService:
      MailService,

    private readonly notificationsService:
      NotificationsService,
  ) { }

  async register(
    dto: RegisterUserDto,
  ) {

    const existingUser =
      await this.usersService
        .getUserByEmail(
          dto.email,
        );

    if (existingUser) {

      throw new BadRequestException(
        'Email already exists',
      );

    }

    const hashPass =
      await bcrypt.hash(
        dto.password,
        10,
      );

    const createdUser =
      await this.usersService
        .createUser(
          {
            fullName:
              dto.fullName,

            email:
              dto.email,

            password:
              hashPass,

            phone:
              dto.phone,

            role:
              Role.CUSTOMER,
          },
        );

    await this.mailService
      .sendWelcomeEmail(
        createdUser.email,
        createdUser.fullName,
      );

    await this.notificationsService
      .create(
        createdUser.id,

        NotificationType.REGISTRATION,

        'Welcome to the Smart Queue Management System.',
      );

    return this.usersService
      .getUserById(
        createdUser.id,
      );
  }

  async login(
    dto: LoginDto,
  ) {

    const user =
      await this.usersService
        .getUserByEmail(
          dto.email,
        );

    if (!user) {

      throw new BadRequestException(
        'Invalid credentials',
      );

    }

    const isMatch =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!isMatch) {

      throw new BadRequestException(
        'Invalid credentials',
      );

    }

    const payload = {
      id:
        user.id,

      email:
        user.email,

      role:
        user.role,
    };

    const access_token =
      this.jwtService.sign(
        payload,
      );

    const refresh_token =
      this.jwtService.sign(
        payload,
        {
          secret:
            this.configService
              .getOrThrow<string>(
                'JWT_REFRESH_SECRET',
              ),

          expiresIn:
            this.configService
              .getOrThrow<string>(
                'JWT_REFRESH_EXPIRES_IN',
              ) as any,
        },
      );

    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(
    token: string,
  ) {

    try {

      const payload =
        await this.jwtService
          .verifyAsync<{
            id: number
          }>(
            token,
            {
              secret:
                this.configService
                  .getOrThrow<string>(
                    'JWT_REFRESH_SECRET',
                  ),
            },
          );

      const user =
        await this.usersService
          .getUserById(
            payload.id,
          );

      const access_token =
        this.jwtService.sign(
          {
            id:
              user.id,

            email:
              user.email,

            role:
              user.role,
          },
        );

      return {
        access_token,
      };

    }

    catch {

      throw new BadRequestException(
        'Invalid or expired refresh token',
      );

    }
  }

  async forgotPassword(
    email: string,
  ) {

    const user =
      await this.usersService
        .getUserByEmail(
          email,
        );

    if (!user) {

      return {
        message:
          'If that email exists, a reset link has been sent',
      };

    }

    const nextVersion =
      user.resetTokenVersion + 1;

    await this.usersService
      .updateResetTokenVersion(
        user.id,
        nextVersion,
      );

    const resetToken =
      this.jwtService.sign(
        {
          id:
            user.id,

          purpose:
            'reset',

          version:
            nextVersion,
        },

        {
          expiresIn:
            '15m',
        },
      );

    await this.mailService
      .sendPasswordResetEmail(
        user.email,
        resetToken,
      );

    await this.notificationsService
      .create(
        user.id,

        NotificationType.PASSWORD_RESET,

        'A password reset was requested for your account.',
      );

    return {
      message:
        'If that email exists, a reset link has been sent',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ) {

    let payload:
      ResetTokenPayload;

    try {

      payload =
        await this.jwtService
          .verifyAsync<ResetTokenPayload>(
            token,
          );

    }

    catch {

      throw new BadRequestException(
        'Invalid or expired reset token',
      );

    }

    if (
      payload.purpose !=
      'reset'
    ) {

      throw new BadRequestException(
        'Invalid token',
      );

    }

    const user =
      await this.usersService
        .getUserById(
          payload.id,
        );

    if (
      payload.version !=
      user.resetTokenVersion
    ) {

      throw new BadRequestException(
        'Reset token has already been used',
      );

    }

    const hashed =
      await bcrypt.hash(
        newPassword,
        10,
      );

    await this.usersService
      .updatePassword(
        user.id,
        hashed,
      );

    await this.usersService
      .updateResetTokenVersion(
        user.id,
        user.resetTokenVersion + 1,
      );

    return {
      message:
        'Password reset successfully',
    };
  }
}