import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @IsString() @IsNotEmpty() name: string;
  @IsArray() @IsNumber({}, { each: true }) permIds: number[];
}