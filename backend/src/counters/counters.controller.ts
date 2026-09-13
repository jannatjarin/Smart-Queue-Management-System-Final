import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
  CountersService,
} from './counters.service';

import {
  CreateCounterDto,
} from './dto/create-counter.dto';

import {
  AssignStaffDto,
} from './dto/assign-staff.dto';

import {
  UpdateCounterStatusDto,
} from './dto/update-status.dto';

@Controller('counters')
@UseGuards(
  JwtGuard,
  RolesGuard,
)
export class CountersController {

  constructor(
    private readonly countersService:
      CountersService,
  ) { }

  @Post()
  @roles(Role.ADMIN)
  create(
    @Body()
    dto: CreateCounterDto,
  ) {

    return this.countersService
      .create(
        dto,
      );
  }

  @Get()
  @roles(
    Role.ADMIN,
    Role.STAFF,
  )
  findAll(
    @CurrentUser()
    user:
      CurrentUserPayload,
  ) {

    return this.countersService
      .findAll(
        user,
      );
  }

  @Get(':id')
  @roles(
    Role.ADMIN,
    Role.STAFF,
  )
  findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @CurrentUser()
    user:
      CurrentUserPayload,
  ) {

    return this.countersService
      .findOne(
        id,
        user,
      );
  }

  @Patch(
    ':id/assign-staff',
  )
  @roles(Role.ADMIN)
  assignStaff(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: AssignStaffDto,
  ) {

    return this.countersService
      .assignStaff(
        id,
        dto.staffId,
      );
  }

  @Patch(':id/status')
  @roles(
    Role.ADMIN,
    Role.STAFF,
  )
  updateStatus(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto:
      UpdateCounterStatusDto,

    @CurrentUser()
    user:
      CurrentUserPayload,
  ) {

    return this.countersService
      .updateStatus(
        id,
        dto,
        user,
      );
  }
}