import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';

export class ListRestaurantsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter restaurants by cuisine',
    example: 'Burgers',
  })
  @IsOptional()
  @IsString()
  cuisine?: string;
}
