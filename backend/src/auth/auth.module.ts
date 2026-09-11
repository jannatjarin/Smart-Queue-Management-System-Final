import { Module } from '@nestjs/common';

import {
  JwtModule,
} from '@nestjs/jwt';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { AuthService } from
  './auth.service';

import { AuthController } from
  './auth.controller';

import { UsersModule } from
  'src/users/users.module';

import { JwtGuard } from
  './jwtGuard';

import { JwtStrategy } from
  './jwtStrategy';

import { RolesGuard } from
  './roles/roles.guard';

import { MailModule } from
  'src/mail/mail.module';

import { NotificationsModule } from
  'src/notifications/notifications.module';

@Module({
  imports: [

    JwtModule.registerAsync(
      {
        global:
          true,

        imports:
          [
            ConfigModule,
          ],

        useFactory:
          (
            config:
              ConfigService,
          ) => (
            {
              secret:
                config.getOrThrow<string>(
                  'JWT_ACCESS_SECRET',
                ),

              signOptions:
              {
                expiresIn:
                  config
                    .getOrThrow<string>(
                      'JWT_ACCESS_EXPIRES_IN',
                    ) as any,
              },
            }
          ),

        inject:
          [
            ConfigService,
          ],
      },
    ),

    UsersModule,

    MailModule,

    NotificationsModule,
  ],

  controllers:
    [
      AuthController,
    ],

  providers:
    [
      AuthService,
      JwtGuard,
      JwtStrategy,
      RolesGuard,
    ],

  exports:
    [
      JwtGuard,
      RolesGuard,
    ],
})
export class AuthModule { }