import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  DataSource,
  In,
  LessThan,
  Repository,
} from 'typeorm';

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
  Users,
} from '../users/users.entity';

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

import {
  NotificationType,
} from '../common/enums/notification-type.enum';

import {
  CreateTicketDto,
} from './dto/create-ticket.dto';

import {
  MailService,
} from '../mail/mail.service';

import {
  NotificationsService,
} from '../notifications/notifications.service';

import {
  CurrentUserPayload,
} from '../common/current-user.interface';

@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Tickets)
    private readonly ticketsRepository:
      Repository<Tickets>,

    @InjectRepository(Services)
    private readonly servicesRepository:
      Repository<Services>,

    @InjectRepository(Queues)
    private readonly queuesRepository:
      Repository<Queues>,

    @InjectRepository(Counters)
    private readonly countersRepository:
      Repository<Counters>,

    private readonly mailService:
      MailService,

    private readonly notificationsService:
      NotificationsService,

    private readonly dataSource:
      DataSource,
  ) { }

  private async findStaffCounter(
    userId: number,
  ): Promise<Counters | null> {

    return this.countersRepository
      .findOne(
        {
          where: {
            staff: {
              id: userId,
            },
          },

          relations: [
            'staff',
            'services',
          ],
        },
      );
  }

  private async getStaffCounter(
    userId: number,
  ): Promise<Counters> {

    const counter =
      await this.findStaffCounter(
        userId,
      );

    if (!counter) {

      throw new BadRequestException(
        'You are not currently assigned to a counter',
      );

    }

    return counter;
  }

  private async calculateEstimatedWait(
    ticket: Tickets,
  ): Promise<number | null> {

    if (
      ticket.status !=
      TicketStatus.WAITING
    ) {

      return 0;

    }

    const peopleAhead =
      await this.ticketsRepository
        .count(
          {
            where: {
              queue: {
                id:
                  ticket.queue.id,
              },

              status:
                TicketStatus.WAITING,

              issuedAt:
                LessThan(
                  ticket.issuedAt,
                ),
            },
          },
        );

    const openCounters =
      await this.countersRepository
        .createQueryBuilder(
          'counter',
        )
        .innerJoin(
          'counter.services',
          'service',
        )
        .where(
          'service.id = :serviceId',

          {
            serviceId:
              ticket.service.id,
          },
        )
        .andWhere(
          'counter.status = :status',

          {
            status:
              CounterStatus.OPEN,
          },
        )
        .getCount();

    if (
      openCounters == 0
    ) {

      return null;

    }

    return (
      Math.ceil(
        peopleAhead /
        openCounters,
      ) *
      ticket.service.estimatedTime
    );
  }

  async create(
    dto: CreateTicketDto,
    currentUser:
      CurrentUserPayload,
  ) {

    const result =
      await this.dataSource
        .transaction(
          async (
            manager,
          ) => {

            const servicesRepository =
              manager
                .getRepository(
                  Services,
                );

            const queuesRepository =
              manager
                .getRepository(
                  Queues,
                );

            const ticketsRepository =
              manager
                .getRepository(
                  Tickets,
                );

            const service =
              await servicesRepository
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
                'Service not found or inactive',
              );

            }

            const queue =
              await queuesRepository
                .createQueryBuilder(
                  'queue',
                )
                .leftJoinAndSelect(
                  'queue.service',
                  'service',
                )
                .setLock(
                  'pessimistic_write',
                )
                .where(
                  'queue.id = :id',

                  {
                    id:
                      dto.queueId,
                  },
                )
                .getOne();

            if (!queue) {

              throw new NotFoundException(
                `Queue with id ${dto.queueId} not found`,
              );

            }

            if (
              queue.service.id !=
              dto.serviceId
            ) {

              throw new BadRequestException(
                'That queue does not belong to the given service',
              );

            }

            if (
              queue.status !=
              QueueStatus.OPEN
            ) {

              throw new BadRequestException(
                'This queue is not currently open',
              );

            }

            const existingActiveTicket =
              await ticketsRepository
                .count(
                  {
                    where: {
                      user: {
                        id:
                          currentUser.id,
                      },

                      queue: {
                        id:
                          queue.id,
                      },

                      status:
                        In(
                          [
                            TicketStatus.WAITING,
                            TicketStatus.CALLED,
                          ],
                        ),
                    },
                  },
                );

            if (
              existingActiveTicket >
              0
            ) {

              throw new BadRequestException(
                'You already have an active ticket in this queue',
              );

            }

            const waitingAhead =
              await ticketsRepository
                .count(
                  {
                    where: {
                      queue: {
                        id:
                          queue.id,
                      },

                      status:
                        TicketStatus.WAITING,
                    },
                  },
                );

            queue.currentTicketNumber +=
              1;

            await queuesRepository
              .save(
                queue,
              );

            const ticketNumber =
              `Q${queue.id}-${String(
                queue.currentTicketNumber,
              ).padStart(
                3,
                '0',
              )}`;

            const ticket =
              ticketsRepository
                .create(
                  {
                    ticketNumber,

                    priority:
                      dto.priority ??
                      'normal',

                    user: {
                      id:
                        currentUser.id,
                    } as Users,

                    service,

                    queue,
                  },
                );

            const saved =
              await ticketsRepository
                .save(
                  ticket,
                );

            const openCounters =
              await manager
                .getRepository(
                  Counters,
                )
                .createQueryBuilder(
                  'counter',
                )
                .innerJoin(
                  'counter.services',
                  'counterService',
                )
                .where(
                  'counterService.id = :serviceId',

                  {
                    serviceId:
                      service.id,
                  },
                )
                .andWhere(
                  'counter.status = :status',

                  {
                    status:
                      CounterStatus.OPEN,
                  },
                )
                .getCount();

            const estimatedWaitMinutes =
              openCounters == 0
                ? null
                : Math.ceil(
                  waitingAhead /
                  openCounters,
                ) *
                service.estimatedTime;

            return {
              ...saved,
              estimatedWaitMinutes,
            };
          },
        );

    await this.notificationsService
      .create(
        currentUser.id,

        NotificationType.TICKET_ISSUED,

        `Ticket ${result.ticketNumber} was issued successfully.`,
      );

    return result;
  }

  async findAll(
    currentUser:
      CurrentUserPayload,

    status?:
      TicketStatus,

    queueId?:
      number,

    sort?:
      'ASC' |
      'DESC',
  ): Promise<Tickets[]> {

    const qb =
      this.ticketsRepository
        .createQueryBuilder(
          'ticket',
        )
        .leftJoinAndSelect(
          'ticket.user',
          'user',
        )
        .leftJoinAndSelect(
          'ticket.service',
          'service',
        )
        .leftJoinAndSelect(
          'ticket.queue',
          'queue',
        )
        .leftJoinAndSelect(
          'ticket.counter',
          'counter',
        );

    if (
      currentUser.role ==
      Role.STAFF
    ) {

      const counter =
        await this.findStaffCounter(
          currentUser.id,
        );

      if (!counter) {

        return [];

      }

      const serviceIds =
        counter.services.map(
          (
            service,
          ) =>
            service.id,
        );

      if (
        serviceIds.length ==
        0
      ) {

        return [];

      }

      qb.andWhere(
        'service.id IN (:...serviceIds)',

        {
          serviceIds,
        },
      );

      if (queueId) {

        const queue =
          await this.queuesRepository
            .findOne(
              {
                where: {
                  id:
                    queueId,
                },

                relations: [
                  'service',
                ],
              },
            );

        if (!queue) {

          throw new NotFoundException(
            `Queue with id ${queueId} not found`,
          );

        }

        if (
          !serviceIds.includes(
            queue.service.id,
          )
        ) {

          throw new ForbiddenException(
            'Your counter does not support this queue service',
          );

        }
      }
    }

    if (status) {

      qb.andWhere(
        'ticket.status = :status',

        {
          status,
        },
      );

    }

    if (queueId) {

      qb.andWhere(
        'queue.id = :queueId',

        {
          queueId,
        },
      );

    }

    qb.orderBy(
      'ticket.issuedAt',

      sort == 'ASC'
        ? 'ASC'
        : 'DESC',
    );

    return qb.getMany();
  }

  async findMyTickets(
    userId: number,
  ) {

    const tickets =
      await this.ticketsRepository
        .find(
          {
            where: {
              user: {
                id:
                  userId,
              },
            },

            relations: [
              'service',
              'queue',
              'counter',
            ],

            order: {
              issuedAt:
                'DESC',
            },
          },
        );

    return Promise.all(
      tickets.map(
        async (
          ticket,
        ) => (
          {
            ...ticket,

            estimatedWaitMinutes:
              await this
                .calculateEstimatedWait(
                  ticket,
                ),
          }
        ),
      ),
    );
  }

  async findOne(
    id: number,
    currentUser:
      CurrentUserPayload,
  ) {

    const ticket =
      await this.ticketsRepository
        .findOne(
          {
            where: {
              id,
            },

            relations: [
              'user',
              'service',
              'queue',
              'counter',
              'counter.staff',
            ],
          },
        );

    if (!ticket) {

      throw new NotFoundException(
        `Ticket with id ${id} not found`,
      );

    }

    if (
      currentUser.role ==
      Role.CUSTOMER &&
      ticket.user.id !=
      currentUser.id
    ) {

      throw new ForbiddenException(
        'You can only view your own tickets',
      );

    }

    if (
      currentUser.role ==
      Role.STAFF
    ) {

      const counter =
        await this.getStaffCounter(
          currentUser.id,
        );

      const supportedServiceIds =
        counter.services.map(
          (
            service,
          ) =>
            service.id,
        );

      if (
        !supportedServiceIds
          .includes(
            ticket.service.id,
          )
      ) {

        throw new ForbiddenException(
          'Your counter does not support this ticket service',
        );

      }
    }

    return {
      ...ticket,

      estimatedWaitMinutes:
        await this
          .calculateEstimatedWait(
            ticket,
          ),
    };
  }

  async callNext(
    queueId: number,
    staffUser:
      CurrentUserPayload,
  ): Promise<Tickets> {

    const queue =
      await this.queuesRepository
        .findOne(
          {
            where: {
              id:
                queueId,
            },

            relations: [
              'service',
            ],
          },
        );

    if (!queue) {

      throw new NotFoundException(
        `Queue with id ${queueId} not found`,
      );

    }

    if (
      queue.status !=
      QueueStatus.OPEN
    ) {

      throw new BadRequestException(
        'This queue is currently closed',
      );

    }

    const counter =
      await this.getStaffCounter(
        staffUser.id,
      );

    if (
      counter.status !=
      CounterStatus.OPEN
    ) {

      throw new BadRequestException(
        'Your assigned counter is currently closed',
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
        'Your counter does not support this queue service',
      );

    }

    const activeCalledTicket =
      await this.ticketsRepository
        .count(
          {
            where: {
              counter: {
                id:
                  counter.id,
              },

              status:
                TicketStatus.CALLED,
            },
          },
        );

    if (
      activeCalledTicket >
      0
    ) {

      throw new BadRequestException(
        'Complete the current called ticket before calling another',
      );

    }

    const nextTicket =
      await this.ticketsRepository
        .findOne(
          {
            where: {
              queue: {
                id:
                  queueId,
              },

              status:
                TicketStatus.WAITING,
            },

            relations: [
              'user',
              'queue',
              'service',
            ],

            order: {
              issuedAt:
                'ASC',
            },
          },
        );

    if (!nextTicket) {

      throw new NotFoundException(
        'No waiting tickets in this queue',
      );

    }

    nextTicket.status =
      TicketStatus.CALLED;

    nextTicket.calledAt =
      new Date();

    nextTicket.counter =
      counter;

    const saved =
      await this.ticketsRepository
        .save(
          nextTicket,
        );

    await this.mailService
      .sendTicketReadyEmail(
        nextTicket.user.email,
        nextTicket.ticketNumber,
        nextTicket.queue.name,
      );

    await this.notificationsService
      .create(
        nextTicket.user.id,

        NotificationType.TICKET_CALLED,

        `Ticket ${nextTicket.ticketNumber} has been called to ${counter.name}.`,
      );

    return saved;
  }

  async complete(
    id: number,
    currentUser:
      CurrentUserPayload,
  ): Promise<Tickets> {

    const ticket =
      await this.ticketsRepository
        .findOne(
          {
            where: {
              id,
            },

            relations: [
              'user',
              'counter',
              'counter.staff',
            ],
          },
        );

    if (!ticket) {

      throw new NotFoundException(
        `Ticket with id ${id} not found`,
      );

    }

    if (
      ticket.status !=
      TicketStatus.CALLED
    ) {

      throw new BadRequestException(
        'Only called tickets can be completed',
      );

    }

    if (
      currentUser.role ==
      Role.STAFF
    ) {

      if (
        !ticket.counter ||
        ticket.counter.staff?.id !=
        currentUser.id
      ) {

        throw new ForbiddenException(
          'You can only complete tickets assigned to your counter',
        );

      }
    }

    ticket.status =
      TicketStatus.COMPLETED;

    ticket.completedAt =
      new Date();

    const saved =
      await this.ticketsRepository
        .save(
          ticket,
        );

    await this.notificationsService
      .create(
        ticket.user.id,

        NotificationType.TICKET_COMPLETED,

        `Ticket ${ticket.ticketNumber} has been completed.`,
      );

    return saved;
  }

  async cancel(
    id: number,
    currentUser:
      CurrentUserPayload,
  ): Promise<Tickets> {

    const ticket =
      await this.ticketsRepository
        .findOne(
          {
            where: {
              id,
            },

            relations: [
              'user',
            ],
          },
        );

    if (!ticket) {

      throw new NotFoundException(
        `Ticket with id ${id} not found`,
      );

    }

    if (
      currentUser.role ==
      Role.CUSTOMER
    ) {

      if (
        ticket.user.id !=
        currentUser.id
      ) {

        throw new ForbiddenException(
          'You can only cancel your own tickets',
        );

      }

      if (
        ticket.status !=
        TicketStatus.WAITING
      ) {

        throw new BadRequestException(
          'Only waiting tickets can be cancelled',
        );

      }
    }

    if (
      currentUser.role ==
      Role.ADMIN &&
      (
        ticket.status ==
        TicketStatus.COMPLETED ||
        ticket.status ==
        TicketStatus.CANCELLED
      )
    ) {

      throw new BadRequestException(
        'This ticket is already finalized',
      );

    }

    ticket.status =
      TicketStatus.CANCELLED;

    const saved =
      await this.ticketsRepository
        .save(
          ticket,
        );

    await this.notificationsService
      .create(
        ticket.user.id,

        NotificationType.TICKET_CANCELLED,

        `Ticket ${ticket.ticketNumber} has been cancelled.`,
      );

    return saved;
  }
}