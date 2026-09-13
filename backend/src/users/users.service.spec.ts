import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  getRepositoryToken,
} from '@nestjs/typeorm';

import {
  UsersService,
} from './users.service';

import {
  Users,
} from './users.entity';

import {
  Counters,
} from '../counters/counters.entity';

import {
  Role,
} from '../common/enums/role.enum';

const mockUsersRepository =
  () => (
    {
      create:
        jest.fn(),

      save:
        jest.fn(),

      findOne:
        jest.fn(),

      update:
        jest.fn(),

      createQueryBuilder:
        jest.fn(),
    }
  );

const mockCountersRepository =
  () => (
    {
      findOne:
        jest.fn(),

      save:
        jest.fn(),
    }
  );

describe(
  'UsersService',
  () => {

    let service:
      UsersService;

    let usersRepo:
      ReturnType<
        typeof mockUsersRepository
      >;

    let countersRepo:
      ReturnType<
        typeof mockCountersRepository
      >;

    beforeEach(
      async () => {

        const module:
          TestingModule =
          await Test
            .createTestingModule(
              {
                providers: [
                  UsersService,

                  {
                    provide:
                      getRepositoryToken(
                        Users,
                      ),

                    useFactory:
                      mockUsersRepository,
                  },

                  {
                    provide:
                      getRepositoryToken(
                        Counters,
                      ),

                    useFactory:
                      mockCountersRepository,
                  },
                ],
              },
            )
            .compile();

        service =
          module.get<UsersService>(
            UsersService,
          );

        usersRepo =
          module.get(
            getRepositoryToken(
              Users,
            ),
          );

        countersRepo =
          module.get(
            getRepositoryToken(
              Counters,
            ),
          );

      },
    );

    it(
      'should be defined',
      () => {

        expect(
          service,
        ).toBeDefined();

      },
    );

    it(
      'creates and saves a user',
      async () => {

        const data = {
          email:
            'a@test.com',

          password:
            'hashed',

          fullName:
            'Test',
        };

        const entity = {
          id: 1,
          ...data,
        };

        usersRepo.create
          .mockReturnValue(
            entity,
          );

        usersRepo.save
          .mockResolvedValue(
            entity,
          );

        const result =
          await service
            .createUser(
              data,
            );

        expect(
          usersRepo.create,
        ).toHaveBeenCalledWith(
          data,
        );

        expect(
          result,
        ).toEqual(
          entity,
        );

      },
    );

    it(
      'gets user by email including password',
      async () => {

        const user = {
          id: 1,
          email:
            'a@test.com',
        };

        const qb = {
          addSelect:
            jest.fn()
              .mockReturnThis(),

          where:
            jest.fn()
              .mockReturnThis(),

          getOne:
            jest.fn()
              .mockResolvedValue(
                user,
              ),
        };

        usersRepo
          .createQueryBuilder
          .mockReturnValue(
            qb,
          );

        const result =
          await service
            .getUserByEmail(
              'a@test.com',
            );

        expect(
          usersRepo
            .createQueryBuilder,
        ).toHaveBeenCalledWith(
          'user',
        );

        expect(
          qb.addSelect,
        ).toHaveBeenCalledWith(
          'user.password',
        );

        expect(
          result,
        ).toEqual(
          user,
        );

      },
    );

    it(
      'throws when user id does not exist',
      async () => {

        usersRepo.findOne
          .mockResolvedValue(
            null,
          );

        await expect(
          service.getUserById(
            999,
          ),
        ).rejects.toThrow(
          NotFoundException,
        );

      },
    );

    it(
      'updates profile and returns fresh user',
      async () => {

        const oldUser = {
          id: 1,
          fullName:
            'Old',
        };

        const newUser = {
          id: 1,
          fullName:
            'New',
        };

        usersRepo.findOne
          .mockResolvedValueOnce(
            oldUser,
          )
          .mockResolvedValueOnce(
            newUser,
          );

        const result =
          await service
            .updateProfile(
              1,
              {
                fullName:
                  'New',
              },
            );

        expect(
          usersRepo.update,
        ).toHaveBeenCalledWith(
          1,
          {
            fullName:
              'New',
          },
        );

        expect(
          result,
        ).toEqual(
          newUser,
        );

      },
    );

    it(
      'updates password',
      async () => {

        await service
          .updatePassword(
            1,
            'newHash',
          );

        expect(
          usersRepo.update,
        ).toHaveBeenCalledWith(
          1,
          {
            password:
              'newHash',
          },
        );

      },
    );

    it(
      'updates reset token version',
      async () => {

        await service
          .updateResetTokenVersion(
            1,
            3,
          );

        expect(
          usersRepo.update,
        ).toHaveBeenCalledWith(
          1,
          {
            resetTokenVersion:
              3,
          },
        );

      },
    );

    it(
      'admin can promote customer to staff',
      async () => {

        usersRepo.findOne
          .mockResolvedValueOnce(
            {
              id: 5,
              role:
                Role.CUSTOMER,
            },
          )
          .mockResolvedValueOnce(
            {
              id: 5,
              role:
                Role.STAFF,
            },
          );

        const result =
          await service
            .updateRole(
              5,
              Role.STAFF,
              1,
            );

        expect(
          usersRepo.update,
        ).toHaveBeenCalledWith(
          5,
          {
            role:
              Role.STAFF,
          },
        );

        expect(
          result.role,
        ).toBe(
          Role.STAFF,
        );

      },
    );

    it(
      'admin can promote another user to admin',
      async () => {

        usersRepo.findOne
          .mockResolvedValueOnce(
            {
              id: 5,
              role:
                Role.CUSTOMER,
            },
          )
          .mockResolvedValueOnce(
            {
              id: 5,
              role:
                Role.ADMIN,
            },
          );

        countersRepo.findOne
          .mockResolvedValue(
            null,
          );

        const result =
          await service
            .updateRole(
              5,
              Role.ADMIN,
              1,
            );

        expect(
          usersRepo.update,
        ).toHaveBeenCalledWith(
          5,
          {
            role:
              Role.ADMIN,
          },
        );

        expect(
          result.role,
        ).toBe(
          Role.ADMIN,
        );

      },
    );

    it(
      'admin cannot demote themselves',
      async () => {

        usersRepo.findOne
          .mockResolvedValue(
            {
              id: 1,
              role:
                Role.ADMIN,
            },
          );

        await expect(
          service.updateRole(
            1,
            Role.CUSTOMER,
            1,
          ),
        ).rejects.toThrow(
          BadRequestException,
        );

      },
    );

    it(
      'builds user search role sorting and pagination query',
      async () => {

        const qb = {
          andWhere:
            jest.fn()
              .mockReturnThis(),

          orderBy:
            jest.fn()
              .mockReturnThis(),

          skip:
            jest.fn()
              .mockReturnThis(),

          take:
            jest.fn()
              .mockReturnThis(),

          getManyAndCount:
            jest.fn()
              .mockResolvedValue(
                [
                  [],
                  0,
                ],
              ),
        };

        usersRepo
          .createQueryBuilder
          .mockReturnValue(
            qb,
          );

        const result =
          await service.findAll(
            'john',
            Role.STAFF,
            'ASC',
            2,
            5,
          );

        expect(
          qb.andWhere,
        ).toHaveBeenCalledWith(
          '(user.fullName ILIKE :search OR user.email ILIKE :search)',
          {
            search:
              '%john%',
          },
        );

        expect(
          qb.andWhere,
        ).toHaveBeenCalledWith(
          'user.role = :role',
          {
            role:
              Role.STAFF,
          },
        );

        expect(
          qb.orderBy,
        ).toHaveBeenCalledWith(
          'user.createDate',
          'ASC',
        );

        expect(
          qb.skip,
        ).toHaveBeenCalledWith(
          5,
        );

        expect(
          qb.take,
        ).toHaveBeenCalledWith(
          5,
        );

        expect(
          result,
        ).toEqual(
          {
            data: [],
            total: 0,
            page: 2,
            limit: 5,
          },
        );

      },
    );

  },
);