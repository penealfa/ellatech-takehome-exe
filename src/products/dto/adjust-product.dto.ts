import { IsNumber } from 'class-validator';

export class AdjustProductDto {
  @IsNumber() adjustment: number; // Positive or negative
}