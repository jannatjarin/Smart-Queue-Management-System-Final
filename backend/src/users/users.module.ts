import { Module } from '@nestjs/common';

import {
  TypeOrmModule,
} from '@nestjs/typeorm';

import {
  UsersController,
} from './users.controller';

import {
  UsersService,
} from './users.service';

import {
  Users,
} from './users.entity';

import {
  Counters,
} from '../counters/counters.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Users,
        Counters,
      ],
    ),
  ],

  controllers: [
    UsersController,
  ],

  providers: [
    UsersService,
  ],

  exports: [
    UsersService,
    TypeOrmModule,
  ],
})
export class UsersModule { }