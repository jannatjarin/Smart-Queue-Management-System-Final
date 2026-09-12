import {
  BadRequestException,
} from '@nestjs/common';

import {
  JwtService,
} from '@nestjs/jwt';

import {
  ConfigService,
} from '@nestjs/config';

import * as bcrypt from 'bcryptjs';

import {
  AuthService,
} from './auth.service';

import {
  UsersService,
} from '../users/users.service';

import {
  MailService,
} from '../mail/mail.service';

import {
  NotificationsService,
} from '../notifications/notifications.service';

import {
  Role,
} from '../common/enums/role.enum';

import {
  NotificationType,
} from '../common/enums/notification-type.enum';

describe('AuthService', () => {

  let service:
    AuthService;

  let usersService: {
    getUserByEmail:
      jest.Mock;

    createUser:
      jest.Mock;

    getUserById:
      jest.Mock;

    updatePassword:
      jest.Mock;

    updateResetTokenVersion:
      jest.Mock;
  };

  let jwtService: {
    sign:
      jest.Mock;

    verifyAsync:
      jest.Mock;
  };

  let configService: {
    getOrThrow:
      jest.Mock;
  };

  let mailService: {
    sendWelcomeEmail:
      jest.Mock;

    sendPasswordResetEmail:
      jest.Mock;
  };

  let notificationsService: {
    create:
      jest.Mock;
  };

  beforeEach(() => {

    usersService = {
      getUserByEmail:
        jest.fn(),

      createUser:
        jest.fn(),

      getUserById:
        jest.fn(),

      updatePassword:
        jest.fn(),

      updateResetTokenVersion:
        jest.fn(),
    };

    jwtService = {
      sign:
        jest.fn(),

      verifyAsync:
        jest.fn(),
    };

    configService = {
      getOrThrow:
        jest.fn(
          (
            key: string,
          ) => {

            if (
              key ==
              'JWT_REFRESH_SECRET'
            ) {

              return 'refresh-secret';

            }

            if (
              key ==
              'JWT_REFRESH_EXPIRES_IN'
            ) {

              return '7d';

            }

            return 'test-value';

          },
        ),
    };

    mailService = {
      sendWelcomeEmail:
        jest.fn(),

      sendPasswordResetEmail:
        jest.fn(),
    };

    notificationsService = {
      create:
        jest.fn(),
    };

    service =
      new AuthService(
        usersService as unknown as UsersService,
        jwtService as unknown as JwtService,
        configService as unknown as ConfigService,
        mailService as unknown as MailService,
        notificationsService as unknown as NotificationsService,
      );

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it(
    'should be defined',
    () => {

      expect(
        service,
      ).toBeDefined();

    },
  );

  it(
    'always registers public users as CUSTOMER',
    async () => {

      usersService
        .getUserByEmail
        .mockResolvedValue(
          null,
        );

      usersService
        .createUser
        .mockResolvedValue(
          {
            id: 1,
            fullName:
              'Test User',
            email:
              'test@test.com',
            role:
              Role.CUSTOMER,
          },
        );

      usersService
        .getUserById
        .mockResolvedValue(
          {
            id: 1,
            fullName:
              'Test User',
            email:
              'test@test.com',
            role:
              Role.CUSTOMER,
          },
        );

      await service.register(
        {
          fullName:
            'Test User',

          email:
            'test@test.com',

          password:
            'password123',
        },
      );

      expect(
        usersService.createUser,
      ).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            role:
              Role.CUSTOMER,
          },
        ),
      );

      expect(
        mailService.sendWelcomeEmail,
      ).toHaveBeenCalled();

      expect(
        notificationsService.create,
      ).toHaveBeenCalledWith(
        1,
        NotificationType.REGISTRATION,
        expect.any(
          String,
        ),
      );

    },
  );

  it(
    'rejects duplicate email registration',
    async () => {

      usersService
        .getUserByEmail
        .mockResolvedValue(
          {
            id: 1,
          },
        );

      await expect(
        service.register(
          {
            fullName:
              'Test User',

            email:
              'test@test.com',

            password:
              'password123',
          },
        ),
      ).rejects.toThrow(
        BadRequestException,
      );

    },
  );

  it(
    'returns access and refresh tokens after login',
    async () => {

      const hashed =
        await bcrypt.hash(
          'password123',
          4,
        );

      usersService
        .getUserByEmail
        .mockResolvedValue(
          {
            id: 1,
            email:
              'test@test.com',
            password:
              hashed,
            role:
              Role.CUSTOMER,
          },
        );

      jwtService.sign
        .mockReturnValueOnce(
          'access-token',
        )
        .mockReturnValueOnce(
          'refresh-token',
        );

      const result =
        await service.login(
          {
            email:
              'test@test.com',

            password:
              'password123',
          },
        );

      expect(
        result,
      ).toEqual(
        {
          access_token:
            'access-token',

          refresh_token:
            'refresh-token',
        },
      );

    },
  );

  it(
    'refresh uses the current database role',
    async () => {

      jwtService
        .verifyAsync
        .mockResolvedValue(
          {
            id: 5,
          },
        );

      usersService
        .getUserById
        .mockResolvedValue(
          {
            id: 5,
            email:
              'staff@test.com',
            role:
              Role.STAFF,
          },
        );

      jwtService.sign
        .mockReturnValue(
          'new-access-token',
        );

      const result =
        await service.refresh(
          'refresh-token',
        );

      expect(
        jwtService.sign,
      ).toHaveBeenCalledWith(
        {
          id: 5,
          email:
            'staff@test.com',
          role:
            Role.STAFF,
        },
      );

      expect(
        result.access_token,
      ).toBe(
        'new-access-token',
      );

    },
  );

  it(
    'forgot password does not reveal unknown email',
    async () => {

      usersService
        .getUserByEmail
        .mockResolvedValue(
          null,
        );

      const result =
        await service.forgotPassword(
          'unknown@test.com',
        );

      expect(
        result.message,
      ).toBe(
        'If that email exists, a reset link has been sent',
      );

      expect(
        mailService.sendPasswordResetEmail,
      ).not.toHaveBeenCalled();

    },
  );

  it(
    'creates a new reset token version',
    async () => {

      usersService
        .getUserByEmail
        .mockResolvedValue(
          {
            id: 4,
            email:
              'user@test.com',
            resetTokenVersion:
              2,
          },
        );

      jwtService.sign
        .mockReturnValue(
          'reset-token',
        );

      await service.forgotPassword(
        'user@test.com',
      );

      expect(
        usersService.updateResetTokenVersion,
      ).toHaveBeenCalledWith(
        4,
        3,
      );

      expect(
        mailService.sendPasswordResetEmail,
      ).toHaveBeenCalledWith(
        'user@test.com',
        'reset-token',
      );

    },
  );

  it(
    'rejects an already used reset token',
    async () => {

      jwtService
        .verifyAsync
        .mockResolvedValue(
          {
            id: 2,
            purpose:
              'reset',
            version:
              1,
          },
        );

      usersService
        .getUserById
        .mockResolvedValue(
          {
            id: 2,
            resetTokenVersion:
              2,
          },
        );

      await expect(
        service.resetPassword(
          'old-token',
          'newpassword',
        ),
      ).rejects.toThrow(
        BadRequestException,
      );

    },
  );

  it(
    'resets password and invalidates token',
    async () => {

      jwtService
        .verifyAsync
        .mockResolvedValue(
          {
            id: 2,
            purpose:
              'reset',
            version:
              3,
          },
        );

      usersService
        .getUserById
        .mockResolvedValue(
          {
            id: 2,
            resetTokenVersion:
              3,
          },
        );

      const result =
        await service.resetPassword(
          'valid-token',
          'newpassword',
        );

      expect(
        usersService.updatePassword,
      ).toHaveBeenCalledWith(
        2,
        expect.any(
          String,
        ),
      );

      expect(
        usersService.updateResetTokenVersion,
      ).toHaveBeenCalledWith(
        2,
        4,
      );

      expect(
        result.message,
      ).toBe(
        'Password reset successfully',
      );

    },
  );
});