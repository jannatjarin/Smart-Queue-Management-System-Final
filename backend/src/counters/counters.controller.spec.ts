import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  CountersController,
} from './counters.controller';

import {
  CountersService,
} from './counters.service';

import {
  Role,
} from '../common/enums/role.enum';

import {
  CounterStatus,
} from '../common/enums/counter-status.enum';

describe(
  'CountersController',
  () => {

    let controller:
      CountersController;

    let service: {
      create:
        jest.Mock;

      findAll:
        jest.Mock;

      findOne:
        jest.Mock;

      assignStaff:
        jest.Mock;

      updateStatus:
        jest.Mock;
    };

    const admin = {
      id: 1,
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

          findAll:
            jest.fn(),

          findOne:
            jest.fn(),

          assignStaff:
            jest.fn(),

          updateStatus:
            jest.fn(),
        };

        const module:
          TestingModule =
          await Test
            .createTestingModule(
              {
                controllers: [
                  CountersController,
                ],

                providers: [
                  {
                    provide:
                      CountersService,

                    useValue:
                      service,
                  },
                ],
              },
            )
            .compile();

        controller =
          module.get<CountersController>(
            CountersController,
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
      'findAll passes current user',
      async () => {

        await controller
          .findAll(
            admin,
          );

        expect(
          service.findAll,
        ).toHaveBeenCalledWith(
          admin,
        );

      },
    );

    it(
      'findOne passes id and current user',
      async () => {

        await controller
          .findOne(
            1,
            admin,
          );

        expect(
          service.findOne,
        ).toHaveBeenCalledWith(
          1,
          admin,
        );

      },
    );

    it(
      'assignStaff passes id and staffId',
      async () => {

        await controller
          .assignStaff(
            1,
            {
              staffId:
                5,
            },
          );

        expect(
          service.assignStaff,
        ).toHaveBeenCalledWith(
          1,
          5,
        );

      },
    );

    it(
      'updateStatus passes current user',
      async () => {

        const dto = {
          status:
            CounterStatus.OPEN,
        };

        await controller
          .updateStatus(
            1,
            dto,
            admin,
          );

        expect(
          service.updateStatus,
        ).toHaveBeenCalledWith(
          1,
          dto,
          admin,
        );

      },
    );

  },
);