import { ApiProperty } from '@nestjs/swagger';

class UserFields {
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

export class AuthResponseDto {
  @ApiProperty()
  user!: UserFields;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  token!: string;
}
