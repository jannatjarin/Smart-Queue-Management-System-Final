import {
  ForbiddenException,
} from '@nestjs/common';

import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  getRepositoryToken,
} from '@nestjs/typeorm';

import {
  CountersService,
} from './counters.service';

import {
  Counters,
} from './counters.entity';

import {
  Users,
} from '../users/users.entity';

import {
  Services,
} from '../services/services.entity';

import {
  Role,
} from '../common/enums/role.enum';

import {
  CounterStatus,
} from '../common/enums/counter-status.enum';

const mockRepository =
  () => (
    {
      create:
        jest.fn(),

      save:
        jest.fn(),

      find:
        jest.fn(),

      findOne:
        jest.fn(),
    }
  );

describe(
  'CountersService',
  () => {

    let service:
      CountersService;

    let countersRepo:
      ReturnType<
        typeof mockRepository
      >;

    let usersRepo:
      ReturnType<
        typeof mockRepository
      >;

    let servicesRepo:
      ReturnType<
        typeof mockRepository
      >;

    const admin = {
      id: 1,
      email:
        'admin@test.com',
      role:
        Role.ADMIN,
    };

    const staff = {
      id: 2,
      email:
        'staff@test.com',
      role:
        Role.STAFF,
    };

    beforeEach(
      async () => {

        const module:
          TestingModule =
          await Test
            .createTestingModule(
              {
                providers: [
                  CountersService,

                  {
                    provide:
                      getRepositoryToken(
                        Counters,
                      ),

                    useFactory:
                      mockRepository,
                  },

                  {
                    provide:
                      getRepositoryToken(
                        Users,
                      ),

                    useFactory:
                      mockRepository,
                  },

                  {
                    provide:
                      getRepositoryToken(
                        Services,
                      ),

                    useFactory:
                      mockRepository,
                  },
                ],
              },
            )
            .compile();

        service =
          module.get<CountersService>(
            CountersService,
          );

        countersRepo =
          module.get(
            getRepositoryToken(
              Counters,
            ),
          );

        usersRepo =
          module.get(
            getRepositoryToken(
              Users,
            ),
          );

        servicesRepo =
          module.get(
            getRepositoryToken(
              Services,
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
      'admin sees all counters',
      async () => {

        countersRepo.find
          .mockResolvedValue(
            [
              {
                id: 1,
              },
            ],
          );

        const result =
          await service.findAll(
            admin,
          );

        expect(
          countersRepo.find,
        ).toHaveBeenCalledWith(
          {
            relations: [
              'staff',
              'services',
            ],
          },
        );

        expect(
          result,
        ).toHaveLength(
          1,
        );

      },
    );

    it(
      'staff sees only their assigned counter',
      async () => {

        countersRepo.find
          .mockResolvedValue(
            [
              {
                id: 4,
              },
            ],
          );

        await service.findAll(
          staff,
        );

        expect(
          countersRepo.find,
        ).toHaveBeenCalledWith(
          {
            where: {
              staff: {
                id: 2,
              },
            },

            relations: [
              'staff',
              'services',
            ],
          },
        );

      },
    );

    it(
      'staff cannot view another staff counter',
      async () => {

        countersRepo.findOne
          .mockResolvedValue(
            {
              id: 1,

              staff: {
                id: 99,
              },

              services: [],
              tickets: [],
            },
          );

        await expect(
          service.findOne(
            1,
            staff,
          ),
        ).rejects.toThrow(
          ForbiddenException,
        );

      },
    );

    it(
      'admin can change counter status',
      async () => {

        const counter = {
          id: 1,
          status:
            CounterStatus.CLOSED,

          staff: null,
          services: [],
          tickets: [],
        };

        countersRepo.findOne
          .mockResolvedValue(
            counter,
          );

        countersRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.updateStatus(
            1,
            {
              status:
                CounterStatus.OPEN,
            },
            admin,
          );

        expect(
          result.status,
        ).toBe(
          CounterStatus.OPEN,
        );

      },
    );

    it(
      'assigns a staff user to a counter',
      async () => {

        const counter = {
          id: 1,
          status:
            CounterStatus.CLOSED,
          staff: null,
          services: [],
          tickets: [],
        };

        const staffUser = {
          id: 2,
          role:
            Role.STAFF,
        };

        countersRepo.findOne
          .mockResolvedValueOnce(
            counter,
          )
          .mockResolvedValueOnce(
            null,
          );

        usersRepo.findOne
          .mockResolvedValue(
            staffUser,
          );

        countersRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.assignStaff(
            1,
            2,
          );

        expect(
          result.staff,
        ).toEqual(
          staffUser,
        );

      },
    );

    it(
      'creates counter with selected active services',
      async () => {

        countersRepo.findOne
          .mockResolvedValue(
            null,
          );

        servicesRepo.find
          .mockResolvedValue(
            [
              {
                id: 1,
                isActive: true,
              },
            ],
          );

        countersRepo.create
          .mockImplementation(
            (
              value,
            ) =>
              value,
          );

        countersRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.create(
            {
              name:
                'Counter 1',

              serviceIds:
                [
                  1,
                ],
            },
          );

        expect(
          result.name,
        ).toBe(
          'Counter 1',
        );

      },
    );

  },
);