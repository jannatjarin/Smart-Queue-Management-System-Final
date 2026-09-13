import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { Notifications } from './notifications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notifications,
    ]),
  ],
  controllers: [
    NotificationsController,
  ],
  providers: [
    NotificationsService,
  ],
  exports: [
    NotificationsService,
  ],
})
export class NotificationsModule {}