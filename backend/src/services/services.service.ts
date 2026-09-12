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

import {
  CreateServiceDto,
} from './dto/create-service.dto';

import {
  UpdateServiceDto,
} from './dto/update-service.dto';

@Injectable()
export class ServicesService {

  constructor(
    @InjectRepository(Services)
    private readonly servicesRepository:
      Repository<Services>,

    @InjectRepository(Queues)
    private readonly queuesRepository:
      Repository<Queues>,

    @InjectRepository(Tickets)
    private readonly ticketsRepository:
      Repository<Tickets>,
  ) {}

  async create(
    dto: CreateServiceDto,
  ): Promise<Services> {

    const service =
      this.servicesRepository
        .create(
          dto,
        );

    return this.servicesRepository
      .save(
        service,
      );
  }

  async findAll(
    includeInactive =
      false,
  ): Promise<Services[]> {

    if (includeInactive) {

      return this.servicesRepository
        .find();

    }

    return this.servicesRepository
      .find(
        {
          where: {
            isActive:
              true,
          },
        },
      );
  }

  async findOne(
    id: number,
  ): Promise<Services> {

    const service =
      await this.servicesRepository
        .findOne(
          {
            where: {
              id,
            },

            relations: [
              'queues',
            ],
          },
        );

    if (!service) {

      throw new NotFoundException(
        `Service with id ${id} not found`,
      );

    }

    return service;
  }

  async update(
    id: number,
    dto: UpdateServiceDto,
  ): Promise<Services> {

    const service =
      await this.findOne(
        id,
      );

    Object.assign(
      service,
      dto,
    );

    return this.servicesRepository
      .save(
        service,
      );
  }

  async deactivate(
    id: number,
  ): Promise<Services> {

    const service =
      await this.findOne(
        id,
      );

    service.isActive =
      false;

    const saved =
      await this.servicesRepository
        .save(
          service,
        );

    const queues =
      await this.queuesRepository
        .find(
          {
            where: {
              service: {
                id,
              },
            },
          },
        );

    if (
      queues.length >
      0
    ) {

      queues.forEach(
        (
          queue,
        ) => {

          queue.status =
            QueueStatus.CLOSED;

        },
      );

      await this.queuesRepository
        .save(
          queues,
        );
    }

    return saved;
  }

  async remove(
    id: number,
  ): Promise<void> {

    const service =
      await this.findOne(
        id,
      );

    const queueCount =
      await this.queuesRepository
        .count(
          {
            where: {
              service: {
                id,
              },
            },
          },
        );

    const ticketCount =
      await this.ticketsRepository
        .count(
          {
            where: {
              service: {
                id,
              },
            },
          },
        );

    if (
      queueCount >
        0 ||
      ticketCount >
        0
    ) {

      throw new BadRequestException(
        'Cannot delete a service that already has queues or ticket history. Deactivate it instead.',
      );

    }

    await this.servicesRepository
      .remove(
        service,
      );
  }
}