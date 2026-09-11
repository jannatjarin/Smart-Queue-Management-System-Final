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
  In,
  Repository,
} from 'typeorm';

import {
  Counters,
} from './counters.entity';

import {
  Users,
} from '../users/users.entity';

import {
  Services,
} from '../services/services.entity';

import {
  Role,
} from '../common/enums/role.enum';

import {
  CreateCounterDto,
} from './dto/create-counter.dto';

import {
  UpdateCounterStatusDto,
} from './dto/update-status.dto';

import {
  CurrentUserPayload,
} from '../common/current-user.interface';

@Injectable()
export class CountersService {

  constructor(
    @InjectRepository(Counters)
    private readonly countersRepository:
      Repository<Counters>,

    @InjectRepository(Users)
    private readonly usersRepository:
      Repository<Users>,

    @InjectRepository(Services)
    private readonly servicesRepository:
      Repository<Services>,
  ) { }

  private async getCounter(
    id: number,
  ): Promise<Counters> {

    const counter =
      await this.countersRepository
        .findOne(
          {
            where: {
              id,
            },

            relations: [
              'staff',
              'services',
              'tickets',
            ],
          },
        );

    if (!counter) {

      throw new NotFoundException(
        `Counter with id ${id} not found`,
      );

    }

    return counter;
  }

  async create(
    dto: CreateCounterDto,
  ): Promise<Counters> {

    const existingCounter =
      await this.countersRepository
        .findOne(
          {
            where: {
              name:
                dto.name,
            },
          },
        );

    if (existingCounter) {

      throw new ConflictException(
        'A counter with this name already exists.',
      );

    }

    let services:
      Services[] = [];

    if (
      dto.serviceIds?.length
    ) {

      services =
        await this.servicesRepository
          .find(
            {
              where: {
                id:
                  In(
                    dto.serviceIds,
                  ),

                isActive:
                  true,
              },
            },
          );

      if (
        services.length !=
        dto.serviceIds.length
      ) {

        throw new NotFoundException(
          'One or more serviceIds do not exist or are inactive',
        );

      }
    }

    const counter =
      this.countersRepository
        .create(
          {
            name:
              dto.name,

            services,
          },
        );

    return this.countersRepository
      .save(
        counter,
      );
  }

  async findAll(
    currentUser:
      CurrentUserPayload,
  ): Promise<Counters[]> {

    if (
      currentUser.role ==
      Role.STAFF
    ) {

      return this.countersRepository
        .find(
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
    }

    return this.countersRepository
      .find(
        {
          relations: [
            'staff',
            'services',
          ],
        },
      );
  }

  async findOne(
    id: number,
    currentUser:
      CurrentUserPayload,
  ): Promise<Counters> {

    const counter =
      await this.getCounter(
        id,
      );

    if (
      currentUser.role ==
      Role.STAFF &&
      counter.staff?.id !=
      currentUser.id
    ) {

      throw new ForbiddenException(
        'You can only view your assigned counter',
      );

    }

    return counter;
  }

  async assignStaff(
    id: number,
    staffId: number,
  ): Promise<Counters> {

    const counter =
      await this.getCounter(
        id,
      );

    const staff =
      await this.usersRepository
        .findOne(
          {
            where: {
              id:
                staffId,
            },
          },
        );

    if (!staff) {

      throw new NotFoundException(
        `User with id ${staffId} not found`,
      );

    }

    if (
      staff.role !=
      Role.STAFF
    ) {

      throw new BadRequestException(
        'Assigned user must have the staff role',
      );

    }

    const existingAssignment =
      await this.countersRepository
        .findOne(
          {
            where: {
              staff: {
                id:
                  staffId,
              },
            },
          },
        );

    if (
      existingAssignment &&
      existingAssignment.id !=
      id
    ) {

      throw new BadRequestException(
        'This staff member is already assigned to another counter',
      );

    }

    counter.staff =
      staff;

    return this.countersRepository
      .save(
        counter,
      );
  }

  async updateStatus(
    id: number,
    dto: UpdateCounterStatusDto,
    currentUser:
      CurrentUserPayload,
  ): Promise<Counters> {

    const counter =
      await this.getCounter(
        id,
      );

    if (
      currentUser.role ==
      Role.STAFF &&
      counter.staff?.id !=
      currentUser.id
    ) {

      throw new ForbiddenException(
        'You can only change the status of your assigned counter',
      );

    }

    counter.status =
      dto.status;

    return this.countersRepository
      .save(
        counter,
      );
  }
}