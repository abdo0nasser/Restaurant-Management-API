import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ example: 'Point' })
  type!: string;

  @ApiProperty({ example: [46.6753, 24.7136] })
  coordinates!: number[];
}

export class RestaurantResponseDto {
  @ApiProperty({ example: '661b8c7b3f0a2c3d4e5f6a7b' })
  _id!: string;

  @ApiProperty({ example: 'مطعم البستان' })
  arName!: string;

  @ApiProperty({ example: 'Al Bustan Restaurant' })
  enName!: string;

  @ApiProperty({ example: 'al-bustan-restaurant' })
  slug!: string;

  @ApiProperty({ example: ['Burgers', 'Fried'] })
  cuisines!: string[];

  @ApiProperty({ type: LocationDto })
  location!: LocationDto;

  @ApiProperty({ example: '2026-05-23T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-05-23T12:00:00.000Z' })
  updatedAt!: string;
}

export class MostFollowedItemDto {
  @ApiProperty({ example: '661b8c7b3f0a2c3d4e5f6a7b' })
  _id!: string;

  @ApiProperty({ example: 'مطعم البستان' })
  arName!: string;

  @ApiProperty({ example: 'Al Bustan Restaurant' })
  enName!: string;

  @ApiProperty({ example: 'al-bustan-restaurant' })
  slug!: string;

  @ApiProperty({ example: ['Burgers', 'Fried'] })
  cuisines!: string[];

  @ApiProperty({ example: 42 })
  count!: number;
}

export class FollowerCountDto {
  @ApiProperty({ example: 42 })
  count!: number;
}
