import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '661b8c7b3f0a2c3d4e5f6a7b' })
  _id!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Ahmed Ali' })
  fullName!: string;

  @ApiProperty({ example: ['Asian', 'Burgers'] })
  favoriteCuisines!: string[];

  @ApiProperty({ example: '2026-05-23T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-05-23T12:00:00.000Z' })
  updatedAt!: string;
}

export class RecommendationResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  users!: UserResponseDto[];

  @ApiProperty({
    type: [Object],
    description: 'List of restaurants followed by similar users',
  })
  restaurants!: any[];
}
