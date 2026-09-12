import {
  Module,
} from '@nestjs/common';

import {
  TypeOrmModule,
} from '@nestjs/typeorm';

import {
  ServicesController,
} from './services.controller';

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

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Services,
        Queues,
        Tickets,
      ],
    ),
  ],

  controllers: [
    ServicesController,
  ],

  providers: [
    ServicesService,
  ],
})
export class ServicesModule {}