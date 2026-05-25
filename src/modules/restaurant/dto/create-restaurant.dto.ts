import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({
    description: 'Restaurant name in Arabic',
    example: 'بيتزا هات',
  })
  @IsString()
  arName!: string;

  @ApiProperty({
    description: 'Restaurant name in English (used to generate the URL slug)',
    example: 'Pizza Hut',
  })
  @IsString()
  enName!: string;

  @ApiProperty({
    description: 'Cuisine categories (1-3 items)',
    example: ['Burgers', 'Fried'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(50, { each: true })
  cuisines!: string[];

  @ApiProperty({
    description: 'Latitude of the restaurant location',
    example: 12.3456,
  })
  @IsLatitude()
  latitude!: number;

  @ApiProperty({
    description: 'Longitude of the restaurant location',
    example: 12.3456,
  })
  @IsLongitude()
  longitude!: number;
}
