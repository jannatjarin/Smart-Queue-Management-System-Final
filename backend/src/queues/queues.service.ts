import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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

import {
  CurrentUserPayload,
} from '../common/current-user.interface';

import {
  CreateQueueDto,
} from './dto/create-queue.dto';

import {
  UpdateQueueDto,
} from './dto/update-queue.dto';

@Injectable()
export class QueuesService {

  constructor(
    @InjectRepository(Queues)
    private readonly queuesRepository:
      Repository<Queues>,

    @InjectRepository(Services)
    private readonly servicesRepository:
      Repository<Services>,

    @InjectRepository(Tickets)
    private readonly ticketsRepository:
      Repository<Tickets>,

    @InjectRepository(Counters)
    private readonly countersRepository:
      Repository<Counters>,
  ) { }

  async create(
    dto: CreateQueueDto,
  ): Promise<Queues> {

    const service =
      await this.servicesRepository
        .findOne(
          {
            where: {
              id:
                dto.serviceId,

              isActive:
                true,
            },
          },
        );

    if (!service) {

      throw new NotFoundException(
        `Active service with id ${dto.serviceId} not found`,
      );

    }

    // Queue entity currently has a global UNIQUE name.
    // So service validation must match the database.
    const existingQueue =
      await this.queuesRepository
        .findOne(
          {
            where: {
              name:
                dto.name,
            },
          },
        );

    if (existingQueue) {

      throw new ConflictException(
        'A queue with this name already exists.',
      );

    }

    const queue =
      this.queuesRepository
        .create(
          {
            name:
              dto.name,

            location:
              dto.location,

            service,
          },
        );

    return this.queuesRepository
      .save(
        queue,
      );
  }

  async findAll(
    serviceId?: number,
    status?: QueueStatus,
  ): Promise<Queues[]> {

    const where:
      Record<string, unknown> =
      {};

    if (serviceId) {

      where.service = {
        id:
          serviceId,
      };

    }

    if (status) {

      where.status =
        status;

    }

    return this.queuesRepository
      .find(
        {
          where,

          relations: [
            'service',
          ],
        },
      );
  }

  async findOne(
    id: number,
  ): Promise<Queues> {

    const queue =
      await this.queuesRepository
        .findOne(
          {
            where: {
              id,
            },

            relations: [
              'service',
            ],
          },
        );

    if (!queue) {

      throw new NotFoundException(
        `Queue with id ${id} not found`,
      );

    }

    return queue;
  }

  async update(
    id: number,
    dto: UpdateQueueDto,
  ): Promise<Queues> {

    const queue =
      await this.findOne(
        id,
      );

    if (
      dto.name !== undefined &&
      dto.name != queue.name
    ) {

      const existingQueue =
        await this.queuesRepository
          .findOne(
            {
              where: {
                name:
                  dto.name,
              },
            },
          );

      if (
        existingQueue &&
        existingQueue.id != id
      ) {

        throw new ConflictException(
          'A queue with this name already exists.',
        );

      }

      queue.name =
        dto.name;
    }

    if (
      dto.location !== undefined
    ) {

      queue.location =
        dto.location;

    }

    return this.queuesRepository
      .save(
        queue,
      );
  }

  async updateStatus(
    id: number,
    status: QueueStatus,
    currentUser:
      CurrentUserPayload,
  ): Promise<Queues> {

    const queue =
      await this.findOne(
        id,
      );

    if (
      currentUser.role ==
      Role.STAFF
    ) {

      const counter =
        await this.countersRepository
          .findOne(
            {
              where: {
                staff: {
                  id:
                    currentUser.id,
                },
              },

              relations: [
                'staff',
                'services',
              ],
            },
          );

      if (!counter) {

        throw new BadRequestException(
          'You are not currently assigned to a counter',
        );

      }

      const supportsService =
        counter.services.some(
          (
            service,
          ) =>
            service.id ==
            queue.service.id,
        );

      if (!supportsService) {

        throw new ForbiddenException(
          'You cannot change the status of this queue',
        );

      }
    }

    queue.status =
      status;

    return this.queuesRepository
      .save(
        queue,
      );
  }

  async remove(
    id: number,
  ): Promise<void> {

    const queue =
      await this.findOne(
        id,
      );

    const ticketCount =
      await this.ticketsRepository
        .count(
          {
            where: {
              queue: {
                id,
              },
            },
          },
        );

    if (
      ticketCount >
      0
    ) {

      throw new BadRequestException(
        'Cannot delete a queue that already has ticket history. Close it instead.',
      );

    }

    await this.queuesRepository
      .remove(
        queue,
      );
  }
}