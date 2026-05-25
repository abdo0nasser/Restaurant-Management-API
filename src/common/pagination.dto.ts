import { IsInt } from 'class-validator';

export class PaginationDto {
  @IsInt()
  page: number = 1;

  @IsInt()
  limit: number = 10;
}
