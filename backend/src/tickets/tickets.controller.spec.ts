import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  TicketsController,
} from './tickets.controller';

import {
  TicketsService,
} from './tickets.service';

import {
  Role,
} from '../common/enums/role.enum';

import {
  TicketStatus,
} from '../common/enums/ticket-status.enum';

describe(
  'TicketsController',
  () => {

    let controller:
      TicketsController;

    let service: {
      create:
        jest.Mock;

      findMyTickets:
        jest.Mock;

      findAll:
        jest.Mock;

      findOne:
        jest.Mock;

      callNext:
        jest.Mock;

      complete:
        jest.Mock;

      cancel:
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

        service = {
          create:
            jest.fn(),

          findMyTickets:
            jest.fn(),

          findAll:
            jest.fn(),

          findOne:
            jest.fn(),

          callNext:
            jest.fn(),

          complete:
            jest.fn(),

          cancel:
            jest.fn(),
        };

        const module:
          TestingModule =
          await Test
            .createTestingModule(
              {
                controllers: [
                  TicketsController,
                ],

                providers: [
                  {
                    provide:
                      TicketsService,

                    useValue:
                      service,
                  },
                ],
              },
            )
            .compile();

        controller =
          module.get<TicketsController>(
            TicketsController,
          );

      },
    );

    it(
      'should be defined',
      () => {

        expect(
          controller,
        ).toBeDefined();

      },
    );

    it(
      'create passes customer to service',
      async () => {

        const dto = {
          serviceId: 1,
          queueId: 1,
          priority:
            'normal' as const,
        };

        await controller.create(
          dto,
          customer,
        );

        expect(
          service.create,
        ).toHaveBeenCalledWith(
          dto,
          customer,
        );

      },
    );

    it(
      'getMyTickets passes user id',
      async () => {

        await controller
          .getMyTickets(
            1,
          );

        expect(
          service.findMyTickets,
        ).toHaveBeenCalledWith(
          1,
        );

      },
    );

    it(
      'findAll passes authenticated user and filters',
      async () => {

        await controller.findAll(
          staff,
          TicketStatus.WAITING,
          2,
          'ASC',
        );

        expect(
          service.findAll,
        ).toHaveBeenCalledWith(
          staff,
          TicketStatus.WAITING,
          2,
          'ASC',
        );

      },
    );

    it(
      'callNext passes staff user',
      async () => {

        await controller.callNext(
          4,
          staff,
        );

        expect(
          service.callNext,
        ).toHaveBeenCalledWith(
          4,
          staff,
        );

      },
    );

    it(
      'complete passes authenticated user',
      async () => {

        await controller.complete(
          1,
          staff,
        );

        expect(
          service.complete,
        ).toHaveBeenCalledWith(
          1,
          staff,
        );

      },
    );

    it(
      'cancel passes authenticated user',
      async () => {

        await controller.cancel(
          1,
          admin,
        );

        expect(
          service.cancel,
        ).toHaveBeenCalledWith(
          1,
          admin,
        );

      },
    );

  },
);