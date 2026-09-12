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
  ServicesService,
} from './services.service';

import {
  Services,
} from './services.entity';

import {
  Queues,
} from '../queues/queues.entity';

import {
  Tickets,
} from '../tickets/tickets.entity';

import {
  QueueStatus,
} from '../common/enums/queue-status.enum';

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
  'ServicesService',
  () => {

    let service:
      ServicesService;

    let servicesRepo:
      ReturnType<
        typeof mockRepository
      >;

    let queuesRepo:
      ReturnType<
        typeof mockRepository
      >;

    let ticketsRepo:
      ReturnType<
        typeof mockRepository
      >;

    beforeEach(
      async () => {

        const module:
          TestingModule =
          await Test
            .createTestingModule(
              {
                providers: [
                  ServicesService,

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
                        Queues,
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
                ],
              },
            )
            .compile();

        service =
          module.get<ServicesService>(
            ServicesService,
          );

        servicesRepo =
          module.get(
            getRepositoryToken(
              Services,
            ),
          );

        queuesRepo =
          module.get(
            getRepositoryToken(
              Queues,
            ),
          );

        ticketsRepo =
          module.get(
            getRepositoryToken(
              Tickets,
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
      'creates a service',
      async () => {

        const dto = {
          name:
            'General Service',

          description:
            'General',

          estimatedTime:
            15,

          department:
            'Support',
        };

        servicesRepo.create
          .mockReturnValue(
            dto,
          );

        servicesRepo.save
          .mockResolvedValue(
            dto,
          );

        const result =
          await service.create(
            dto,
          );

        expect(
          result,
        ).toEqual(
          dto,
        );

      },
    );

    it(
      'throws when service does not exist',
      async () => {

        servicesRepo.findOne
          .mockResolvedValue(
            null,
          );

        await expect(
          service.findOne(
            99,
          ),
        ).rejects.toThrow(
          NotFoundException,
        );

      },
    );

    it(
      'deactivates service and closes its queues',
      async () => {

        const serviceEntity = {
          id: 1,
          isActive: true,
          queues: [],
        };

        const queues = [
          {
            id: 1,
            status:
              QueueStatus.OPEN,
          },
        ];

        servicesRepo.findOne
          .mockResolvedValue(
            serviceEntity,
          );

        /*
         * This mock is harmless if your current
         * deactivate() version does not yet call
         * ticketsRepository.count().
         */
        ticketsRepo.count
          .mockResolvedValue(
            0,
          );

        servicesRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        queuesRepo.find
          .mockResolvedValue(
            queues,
          );

        queuesRepo.save
          .mockResolvedValue(
            queues,
          );

        const result =
          await service.deactivate(
            1,
          );

        expect(
          result.isActive,
        ).toBe(
          false,
        );

        expect(
          queues[0].status,
        ).toBe(
          QueueStatus.CLOSED,
        );

      },
    );

    it(
      'does not delete a service with queues',
      async () => {

        servicesRepo.findOne
          .mockResolvedValue(
            {
              id: 1,
              queues: [],
            },
          );

        queuesRepo.count
          .mockResolvedValue(
            1,
          );

        ticketsRepo.count
          .mockResolvedValue(
            0,
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
      'deletes an unused service',
      async () => {

        const serviceEntity = {
          id: 1,
          queues: [],
        };

        servicesRepo.findOne
          .mockResolvedValue(
            serviceEntity,
          );

        queuesRepo.count
          .mockResolvedValue(
            0,
          );

        ticketsRepo.count
          .mockResolvedValue(
            0,
          );

        await service.remove(
          1,
        );

        expect(
          servicesRepo.remove,
        ).toHaveBeenCalledWith(
          serviceEntity,
        );

      },
    );

  },
);