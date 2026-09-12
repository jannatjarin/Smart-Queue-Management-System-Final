import {
  BadRequestException,
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
  QueuesService,
} from './queues.service';

import {
  Queues,
} from './queues.entity';

import {
  Services,
} from '../services/services.entity';

import {
  Tickets,
} from '../tickets/tickets.entity';

import {
  Counters,
} from '../counters/counters.entity';

import {
  QueueStatus,
} from '../common/enums/queue-status.enum';

import {
  Role,
} from '../common/enums/role.enum';

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

      remove:
        jest.fn(),

      count:
        jest.fn(),
    }
  );

describe(
  'QueuesService',
  () => {

    let service:
      QueuesService;

    let queuesRepo:
      ReturnType<
        typeof mockRepository
      >;

    let servicesRepo:
      ReturnType<
        typeof mockRepository
      >;

    let ticketsRepo:
      ReturnType<
        typeof mockRepository
      >;

    let countersRepo:
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
                  QueuesService,

                  {
                    provide:
                      getRepositoryToken(
                        Queues,
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

                  {
                    provide:
                      getRepositoryToken(
                        Tickets,
                      ),

                    useFactory:
                      mockRepository,
                  },

                  {
                    provide:
                      getRepositoryToken(
                        Counters,
                      ),

                    useFactory:
                      mockRepository,
                  },
                ],
              },
            )
            .compile();

        service =
          module.get<QueuesService>(
            QueuesService,
          );

        queuesRepo =
          module.get(
            getRepositoryToken(
              Queues,
            ),
          );

        servicesRepo =
          module.get(
            getRepositoryToken(
              Services,
            ),
          );

        ticketsRepo =
          module.get(
            getRepositoryToken(
              Tickets,
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
      'creates queue for active service',
      async () => {

        const activeService = {
          id: 1,
          isActive: true,
        };

        servicesRepo.findOne
          .mockResolvedValue(
            activeService,
          );

        queuesRepo.findOne
          .mockResolvedValue(
            null,
          );

        queuesRepo.create
          .mockImplementation(
            (
              value,
            ) =>
              value,
          );

        queuesRepo.save
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
                'Main Queue',

              location:
                'Floor 1',

              serviceId:
                1,
            },
          );

        expect(
          result.name,
        ).toBe(
          'Main Queue',
        );

      },
    );

    it(
      'admin can update any queue status',
      async () => {

        const queue = {
          id: 1,
          status:
            QueueStatus.CLOSED,

          service: {
            id: 3,
          },
        };

        jest.spyOn(
          service,
          'findOne',
        )
          .mockResolvedValue(
            queue as Queues,
          );

        queuesRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.updateStatus(
            1,
            QueueStatus.OPEN,
            admin,
          );

        expect(
          result.status,
        ).toBe(
          QueueStatus.OPEN,
        );

        expect(
          countersRepo.findOne,
        ).not.toHaveBeenCalled();

      },
    );

    it(
      'staff can update supported queue status',
      async () => {

        const queue = {
          id: 1,
          status:
            QueueStatus.CLOSED,

          service: {
            id: 3,
          },
        };

        jest.spyOn(
          service,
          'findOne',
        )
          .mockResolvedValue(
            queue as Queues,
          );

        countersRepo.findOne
          .mockResolvedValue(
            {
              id: 8,

              services: [
                {
                  id: 3,
                },
              ],
            },
          );

        queuesRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.updateStatus(
            1,
            QueueStatus.OPEN,
            staff,
          );

        expect(
          result.status,
        ).toBe(
          QueueStatus.OPEN,
        );

      },
    );

    it(
      'staff cannot update unsupported queue status',
      async () => {

        jest.spyOn(
          service,
          'findOne',
        )
          .mockResolvedValue(
            {
              id: 1,

              service: {
                id: 99,
              },
            } as Queues,
          );

        countersRepo.findOne
          .mockResolvedValue(
            {
              services: [
                {
                  id: 3,
                },
              ],
            },
          );

        await expect(
          service.updateStatus(
            1,
            QueueStatus.OPEN,
            staff,
          ),
        ).rejects.toThrow(
          ForbiddenException,
        );

      },
    );

    it(
      'cannot delete queue with ticket history',
      async () => {

        jest.spyOn(
          service,
          'findOne',
        )
          .mockResolvedValue(
            {
              id: 1,
            } as Queues,
          );

        ticketsRepo.count
          .mockResolvedValue(
            2,
          );

        await expect(
          service.remove(
            1,
          ),
        ).rejects.toThrow(
          BadRequestException,
        );

      },
    );

    it(
      'deletes unused queue',
      async () => {

        const queue = {
          id: 1,
        } as Queues;

        jest.spyOn(
          service,
          'findOne',
        )
          .mockResolvedValue(
            queue,
          );

        ticketsRepo.count
          .mockResolvedValue(
            0,
          );

        await service.remove(
          1,
        );

        expect(
          queuesRepo.remove,
        ).toHaveBeenCalledWith(
          queue,
        );

      },
    );

  },
);