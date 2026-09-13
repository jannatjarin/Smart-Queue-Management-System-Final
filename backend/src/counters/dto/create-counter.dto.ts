import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCounterDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({
    each: true,
  })
  @IsPositive({
    each: true,
  })
  serviceIds: number[];
}