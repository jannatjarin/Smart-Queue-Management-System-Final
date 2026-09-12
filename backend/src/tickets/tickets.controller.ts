import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  JwtGuard,
} from '../auth/jwtGuard';

import {
  RolesGuard,
} from '../auth/roles/roles.guard';

import {
  roles,
} from '../auth/roles.decrator';

import {
  Role,
} from '../common/enums/role.enum';

import {
  CurrentUser,
} from '../common/current-user.decorator';

import type {
  CurrentUserPayload,
} from '../common/current-user.interface';

import {
  TicketStatus,
} from '../common/enums/ticket-status.enum';

import {
  TicketsService,
} from './tickets.service';

import {
  CreateTicketDto,
} from './dto/create-ticket.dto';

@Controller('tickets')
@UseGuards(JwtGuard)
export class TicketsController {

  constructor(
    private readonly ticketsService:
      TicketsService,
  ) { }

  @Post()
  @UseGuards(RolesGuard)
  @roles(Role.CUSTOMER)
  create(
    @Body()
    dto: CreateTicketDto,

    @CurrentUser()
    user: CurrentUserPayload,
  ) {

    return this.ticketsService
      .create(
        dto,
        user,
      );
  }

  @Get('mytickets')
  @UseGuards(RolesGuard)
  @roles(Role.CUSTOMER)
  getMyTickets(
    @CurrentUser('id')
    userId: number,
  ) {

    return this.ticketsService
      .findMyTickets(
        userId,
      );
  }

  @Get()
  @UseGuards(RolesGuard)
  @roles(
    Role.ADMIN,
    Role.STAFF,
  )
  findAll(
    @CurrentUser()
    user: CurrentUserPayload,

    @Query('status')
    status?: TicketStatus,

    @Query(
      'queueId',
      new ParseIntPipe(
        {
          optional:
            true,
        },
      ),
    )
    queueId?: number,

    @Query('sort')
    sort?: 'ASC' | 'DESC',
  ) {

    return this.ticketsService
      .findAll(
        user,
        status,
        queueId,
        sort,
      );
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @roles(
    Role.ADMIN,
    Role.STAFF,
    Role.CUSTOMER,
  )
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @CurrentUser()
    user: CurrentUserPayload,
  ) {

    return this.ticketsService
      .findOne(
        id,
        user,
      );
  }

  @Patch(
    'queue/:queueId/next',
  )
  @UseGuards(RolesGuard)
  @roles(Role.STAFF)
  callNext(
    @Param(
      'queueId',
      ParseIntPipe,
    )
    queueId: number,

    @CurrentUser()
    user: CurrentUserPayload,
  ) {

    return this.ticketsService
      .callNext(
        queueId,
        user,
      );
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @roles(
    Role.STAFF,
    Role.ADMIN,
  )
  complete(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @CurrentUser()
    user: CurrentUserPayload,
  ) {

    return this.ticketsService
      .complete(
        id,
        user,
      );
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @roles(
    Role.CUSTOMER,
    Role.ADMIN,
  )
  cancel(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @CurrentUser()
    user: CurrentUserPayload,
  ) {

    return this.ticketsService
      .cancel(
        id,
        user,
      );
  }
}