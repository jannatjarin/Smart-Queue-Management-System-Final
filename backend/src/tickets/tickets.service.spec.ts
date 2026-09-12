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
  DataSource,
} from 'typeorm';

import {
  TicketsService,
} from './tickets.service';

import {
  Tickets,
} from './tickets.entity';

import {
  Services,
} from '../services/services.entity';

import {
  Queues,
} from '../queues/queues.entity';

import {
  Counters,
} from '../counters/counters.entity';

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
  TicketStatus,
} from '../common/enums/ticket-status.enum';

import {
  QueueStatus,
} from '../common/enums/queue-status.enum';

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

      count:
        jest.fn(),

      createQueryBuilder:
        jest.fn(),
    }
  );

describe(
  'TicketsService',
  () => {

    let service:
      TicketsService;

    let ticketsRepo:
      ReturnType<
        typeof mockRepository
      >;

    let queuesRepo:
      ReturnType<
        typeof mockRepository
      >;

    let countersRepo:
      ReturnType<
        typeof mockRepository
      >;

    let mailService: {
      sendTicketReadyEmail:
        jest.Mock;
    };

    let notificationsService: {
      create:
        jest.Mock;
    };

    const customer = {
      id: 1,
      email:
        'customer@test.com',
      role:
        Role.CUSTOMER,
    };

    const staff = {
      id: 2,
      email:
        'staff@test.com',
      role:
        Role.STAFF,
    };

    const admin = {
      id: 3,
      email:
        'admin@test.com',
      role:
        Role.ADMIN,
    };

    beforeEach(
      async () => {

        const dataSource = {
          transaction:
            jest.fn(),
        };

        const module:
          TestingModule =
          await Test
            .createTestingModule(
              {
                providers: [
                  TicketsService,

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
                        Counters,
                      ),

                    useFactory:
                      mockRepository,
                  },

                  {
                    provide:
                      MailService,

                    useValue:
                      {
                        sendTicketReadyEmail:
                          jest.fn(),
                      },
                  },

                  {
                    provide:
                      NotificationsService,

                    useValue:
                      {
                        create:
                          jest.fn(),
                      },
                  },

                  {
                    provide:
                      DataSource,

                    useValue:
                      dataSource,
                  },
                ],
              },
            )
            .compile();

        service =
          module.get<TicketsService>(
            TicketsService,
          );

        ticketsRepo =
          module.get(
            getRepositoryToken(
              Tickets,
            ),
          );

        queuesRepo =
          module.get(
            getRepositoryToken(
              Queues,
            ),
          );

        countersRepo =
          module.get(
            getRepositoryToken(
              Counters,
            ),
          );

        mailService =
          module.get(
            MailService,
          );

        notificationsService =
          module.get(
            NotificationsService,
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
      'admin can list tickets',
      async () => {

        const qb = {
          leftJoinAndSelect:
            jest.fn()
              .mockReturnThis(),

          andWhere:
            jest.fn()
              .mockReturnThis(),

          orderBy:
            jest.fn()
              .mockReturnThis(),

          getMany:
            jest.fn()
              .mockResolvedValue(
                [
                  {
                    id: 1,
                  },
                ],
              ),
        };

        ticketsRepo
          .createQueryBuilder
          .mockReturnValue(
            qb,
          );

        const result =
          await service.findAll(
            admin,
          );

        expect(
          result,
        ).toHaveLength(
          1,
        );

      },
    );

    it(
      'returns customer ticket history',
      async () => {

        ticketsRepo.find
          .mockResolvedValue(
            [
              {
                id: 1,
                status:
                  TicketStatus.COMPLETED,

                service: {
                  id: 1,
                  estimatedTime: 15,
                },

                queue: {
                  id: 1,
                },

                counter: {
                  id: 1,
                },
              },
            ],
          );

        const result =
          await service
            .findMyTickets(
              1,
            );

        expect(
          result[0]
            .estimatedWaitMinutes,
        ).toBe(
          0,
        );

      },
    );

    it(
      'staff can call next ticket only from supported open queue',
      async () => {

        queuesRepo.findOne
          .mockResolvedValue(
            {
              id: 1,
              name:
                'Queue 1',
              status:
                QueueStatus.OPEN,

              service: {
                id: 5,
              },
            },
          );

        countersRepo.findOne
          .mockResolvedValue(
            {
              id: 4,
              name:
                'Counter 1',
              status:
                CounterStatus.OPEN,

              staff: {
                id: 2,
              },

              services: [
                {
                  id: 5,
                },
              ],
            },
          );

        ticketsRepo.count
          .mockResolvedValue(
            0,
          );

        const nextTicket = {
          id: 10,
          ticketNumber:
            'Q1-001',

          status:
            TicketStatus.WAITING,

          user: {
            id: 1,
            email:
              'customer@test.com',
          },

          queue: {
            id: 1,
            name:
              'Queue 1',
          },

          service: {
            id: 5,
          },

          counter: null,
        };

        ticketsRepo.findOne
          .mockResolvedValue(
            nextTicket,
          );

        ticketsRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.callNext(
            1,
            staff,
          );

        expect(
          result.status,
        ).toBe(
          TicketStatus.CALLED,
        );

        expect(
          result.counter?.id,
        ).toBe(
          4,
        );

        expect(
          mailService.sendTicketReadyEmail,
        ).toHaveBeenCalled();

        expect(
          notificationsService.create,
        ).toHaveBeenCalled();

      },
    );

    it(
      'staff cannot complete another counter ticket',
      async () => {

        ticketsRepo.findOne
          .mockResolvedValue(
            {
              id: 1,
              status:
                TicketStatus.CALLED,

              user: {
                id: 1,
              },

              counter: {
                id: 9,

                staff: {
                  id: 99,
                },
              },
            },
          );

        await expect(
          service.complete(
            1,
            staff,
          ),
        ).rejects.toThrow(
          ForbiddenException,
        );

      },
    );

    it(
      'admin can complete a called ticket',
      async () => {

        const ticket = {
          id: 1,
          ticketNumber:
            'Q1-001',

          status:
            TicketStatus.CALLED,

          user: {
            id: 5,
          },

          counter: null,
        };

        ticketsRepo.findOne
          .mockResolvedValue(
            ticket,
          );

        ticketsRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.complete(
            1,
            admin,
          );

        expect(
          result.status,
        ).toBe(
          TicketStatus.COMPLETED,
        );

        expect(
          notificationsService.create,
        ).toHaveBeenCalled();

      },
    );

    it(
      'customer can cancel own waiting ticket',
      async () => {

        const ticket = {
          id: 1,
          ticketNumber:
            'Q1-001',

          status:
            TicketStatus.WAITING,

          user: {
            id: 1,
          },
        };

        ticketsRepo.findOne
          .mockResolvedValue(
            ticket,
          );

        ticketsRepo.save
          .mockImplementation(
            async (
              value,
            ) =>
              value,
          );

        const result =
          await service.cancel(
            1,
            customer,
          );

        expect(
          result.status,
        ).toBe(
          TicketStatus.CANCELLED,
        );

        expect(
          notificationsService.create,
        ).toHaveBeenCalled();

      },
    );

    it(
      'customer cannot cancel someone else ticket',
      async () => {

        ticketsRepo.findOne
          .mockResolvedValue(
            {
              id: 1,
              status:
                TicketStatus.WAITING,

              user: {
                id: 999,
              },
            },
          );

        await expect(
          service.cancel(
            1,
            customer,
          ),
        ).rejects.toThrow(
          ForbiddenException,
        );

      },
    );

    it(
      'staff cannot cancel tickets',
      async () => {

        ticketsRepo.findOne
          .mockResolvedValue(
            {
              id: 1,
              status:
                TicketStatus.WAITING,

              user: {
                id: 1,
              },
            },
          );

        await expect(
          service.cancel(
            1,
            staff,
          ),
        ).rejects.toThrow(
          ForbiddenException,
        );

      },
    );

    it(
      'admin cannot cancel completed ticket',
      async () => {

        ticketsRepo.findOne
          .mockResolvedValue(
            {
              id: 1,
              status:
                TicketStatus.COMPLETED,

              user: {
                id: 1,
              },
            },
          );

        await expect(
          service.cancel(
            1,
            admin,
          ),
        ).rejects.toThrow(
          BadRequestException,
        );

      },
    );

  },
);