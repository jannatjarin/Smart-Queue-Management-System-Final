import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import {
  Users,
} from './users.entity';

import {
  Counters,
} from '../counters/counters.entity';

import {
  Role,
} from 'src/common/enums/role.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly usersRepo:
      Repository<Users>,

    @InjectRepository(Counters)
    private readonly countersRepo:
      Repository<Counters>,
  ) { }

  async createUser(
    data: Partial<Users>,
  ): Promise<Users> {

    const user =
      this.usersRepo.create(
        data,
      );

    return this.usersRepo.save(
      user,
    );
  }

  async getUserByEmail(
    email: string,
  ): Promise<Users | null> {

    return this.usersRepo
      .createQueryBuilder(
        'user',
      )
      .addSelect(
        'user.password',
      )
      .where(
        'user.email = :email',
        {
          email,
        },
      )
      .getOne();
  }

  async getUserById(
    id: number,
  ): Promise<Users> {

    const user =
      await this.usersRepo
        .findOne(
          {
            where: {
              id,
            },
          },
        );

    if (!user) {

      throw new NotFoundException(
        'User not found',
      );

    }

    return user;
  }

  async updateProfile(
    id: number,

    data: {
      fullName?: string;
      phone?: string;
    },
  ): Promise<Users> {

    await this.getUserById(
      id,
    );

    await this.usersRepo.update(
      id,
      data,
    );

    return this.getUserById(
      id,
    );
  }

  async updatePassword(
    id: number,
    hashedPassword: string,
  ): Promise<void> {

    await this.usersRepo.update(
      id,
      {
        password:
          hashedPassword,
      },
    );
  }

  async updateResetTokenVersion(
    id: number,
    version: number,
  ): Promise<void> {

    await this.usersRepo.update(
      id,
      {
        resetTokenVersion:
          version,
      },
    );
  }

  async updateRole(
    id: number,
    role: Role,
    currentAdminId: number,
  ): Promise<Users> {

    const user =
      await this.getUserById(
        id,
      );

    if (
      id == currentAdminId &&
      role != Role.ADMIN
    ) {

      throw new BadRequestException(
        'You cannot remove your own admin role',
      );

    }

    if (
      role != Role.STAFF
    ) {

      const counter =
        await this.countersRepo
          .findOne(
            {
              where: {
                staff: {
                  id,
                },
              },

              relations: [
                'staff',
              ],
            },
          );

      if (counter) {

        counter.staff =
          null;

        await this.countersRepo.save(
          counter,
        );
      }
    }

    if (
      user.role != role
    ) {

      await this.usersRepo.update(
        id,
        {
          role,
        },
      );

    }

    return this.getUserById(
      id,
    );
  }

  async findAll(
    search?: string,
    role?: Role,
    sort?: 'ASC' | 'DESC',
    page = 1,
    limit = 10,
  ) {

    const qb =
      this.usersRepo
        .createQueryBuilder(
          'user',
        );

    if (search) {

      qb.andWhere(
        '(user.fullName ILIKE :search OR user.email ILIKE :search)',

        {
          search:
            `%${search}%`,
        },
      );

    }

    if (role) {

      qb.andWhere(
        'user.role = :role',

        {
          role,
        },
      );

    }

    qb.orderBy(
      'user.createDate',

      sort == 'ASC'
        ? 'ASC'
        : 'DESC',
    );

    const safePage =
      page > 0
        ? page
        : 1;

    const safeLimit =
      limit > 0
        ? Math.min(
          limit,
          100,
        )
        : 10;

    qb.skip(
      (safePage - 1) *
      safeLimit,
    )
      .take(
        safeLimit,
      );

    const [
      data,
      total,
    ] =
      await qb
        .getManyAndCount();

    return {
      data,
      total,
      page:
        safePage,

      limit:
        safeLimit,
    };
  }
}