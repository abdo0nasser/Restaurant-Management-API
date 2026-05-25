import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';

export class NearbyRestaurantsQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'Latitude of the center point',
    example: 24.7136,
  })
  @IsLatitude()
  latitude!: number;

  @ApiProperty({
    description: 'Longitude of the center point',
    example: 46.6753,
  })
  @IsLongitude()
  longitude!: number;
}
