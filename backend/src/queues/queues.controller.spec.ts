import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  QueuesController,
} from './queues.controller';

import {
  QueuesService,
} from './queues.service';

import {
  QueueStatus,
} from '../common/enums/queue-status.enum';

import {
  Role,
} from '../common/enums/role.enum';

describe(
  'QueuesController',
  () => {

    let controller:
      QueuesController;

    let service: {
      create:
        jest.Mock;

      findAll:
        jest.Mock;

      findOne:
        jest.Mock;

      update:
        jest.Mock;

      updateStatus:
        jest.Mock;

      remove:
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

          update:
            jest.fn(),

          updateStatus:
            jest.fn(),

          remove:
            jest.fn(),
        };

        const module:
          TestingModule =
          await Test
            .createTestingModule(
              {
                controllers: [
                  QueuesController,
                ],

                providers: [
                  {
                    provide:
                      QueuesService,

                    useValue:
                      service,
                  },
                ],
              },
            )
            .compile();

        controller =
          module.get<QueuesController>(
            QueuesController,
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
      'create delegates to service',
      async () => {

        const dto = {
          name:
            'Queue 1',
          location:
            'Floor 1',
          serviceId:
            1,
        };

        await controller.create(
          dto,
        );

        expect(
          service.create,
        ).toHaveBeenCalledWith(
          dto,
        );

      },
    );

    it(
      'findAll delegates to service',
      async () => {

        await controller.findAll(
          1,
          QueueStatus.OPEN,
        );

        expect(
          service.findAll,
        ).toHaveBeenCalledWith(
          1,
          QueueStatus.OPEN,
        );

      },
    );

    it(
      'updateStatus passes authenticated user',
      async () => {

        const dto = {
          status:
            QueueStatus.OPEN,
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
          QueueStatus.OPEN,
          admin,
        );

      },
    );

    it(
      'remove delegates to service',
      async () => {

        await controller.remove(
          1,
        );

        expect(
          service.remove,
        ).toHaveBeenCalledWith(
          1,
        );

      },
    );

  },
);