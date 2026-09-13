import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          AuthController,
        ],

        providers: [
          {
            provide:
              AuthService,

            useValue:
              authService,
          },
        ],
      }).compile();

    controller =
      module.get<AuthController>(
        AuthController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register delegates to authService.register', async () => {
    const dto = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '01700000000',
    };

    authService.register.mockResolvedValue(
      {
        id: 1,
      },
    );

    await controller.register(dto);

    expect(
      authService.register,
    ).toHaveBeenCalledWith(
      dto,
    );
  });

  it('login delegates to authService.login', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
    };

    authService.login.mockResolvedValue(
      {
        access_token: 'access',
        refresh_token: 'refresh',
      },
    );

    await controller.login(dto);

    expect(
      authService.login,
    ).toHaveBeenCalledWith(
      dto,
    );
  });
});