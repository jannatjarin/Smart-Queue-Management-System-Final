import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateTicketDto {

  @IsInt()
  @IsPositive()
  serviceId: number;

  @IsInt()
  @IsPositive()
  queueId: number;

  @IsOptional()
  @IsIn([
    'normal',
    'urgent',
  ])
  priority?:
    'normal' |
    'urgent';
}