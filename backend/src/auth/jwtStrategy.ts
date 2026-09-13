import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PassportStrategy,
} from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import {
  ConfigService,
} from '@nestjs/config';

import {
  UsersService,
} from 'src/users/users.service';

interface TokenPayload {
  id: number;
  email: string;
}

@Injectable()
export class JwtStrategy
  extends PassportStrategy(
    Strategy,
  ) {

  constructor(
    private readonly configService:
      ConfigService,

    private readonly usersService:
      UsersService,
  ) {

    super(
      {
        jwtFromRequest:
          ExtractJwt
            .fromAuthHeaderAsBearerToken(),

        ignoreExpiration:
          false,

        secretOrKey:
          configService
            .getOrThrow<string>(
              'JWT_ACCESS_SECRET',
            ),
      },
    );
  }

  async validate(
    payload: TokenPayload,
  ) {

    try {

      const user =
        await this.usersService
          .getUserById(
            payload.id,
          );

      return {
        id:
          user.id,

        email:
          user.email,

        role:
          user.role,
      };

    }

    catch {

      throw new UnauthorizedException(
        'User no longer exists',
      );

    }
  }
}