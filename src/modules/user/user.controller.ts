import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import {
  CreateUserDto,
  RecommendationResponseDto,
  UserResponseDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaginationDto } from 'src/common/pagination.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('follow/:restaurantId')
  @ApiOperation({
    summary: 'Follow a restaurant',
    description:
      'Creates a follow relationship between a user and a restaurant.',
  })
  @ApiParam({
    name: 'restaurantId',
    description: 'MongoDB ObjectId of the restaurant',
    example: '6a1251d6ad009691c141c6b6',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Now following the restaurant',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Already following',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User or restaurant not found',
  })
  async follow(
    @CurrentUser() user,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.userService.followRestaurant(user.id, restaurantId);
  }

  @Delete('follow/:restaurantId')
  @ApiOperation({
    summary: 'Unfollow a restaurant',
    description:
      'Removes a follow relationship between a user and a restaurant.',
  })
  @ApiParam({
    name: 'restaurantId',
    description: 'MongoDB ObjectId of the restaurant',
    example: '6a1251d6ad009691c141c6b6',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Unfollowed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Follow relation not found',
  })
  async unfollow(
    @CurrentUser() user,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.userService.unfollowRestaurant(user.id, restaurantId);
  }

  @Get('recommendations')
  @ApiOperation({
    summary: 'Get restaurant recommendations',
    description:
      'Finds users who share the same favorite cuisines, then returns those users and the restaurants they follow. Uses MongoDB aggregation pipeline.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'limit of the answer',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'page number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recommended users and restaurants',
    type: RecommendationResponseDto,
  })
  async recommend(@CurrentUser() user, @Query() paginationDto: PaginationDto) {
    return await this.userService.recommend(user.id, paginationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all users',
    description: 'Returns all registered users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users',
    type: [UserResponseDto],
  })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('follows')
  @ApiOperation({
    summary: 'Get followed restaurants',
    description: 'Returns all restaurants that a user follows.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of followed restaurants',
    type: [Object],
  })
  async getFollowedRestaurants(@CurrentUser() user) {
    return await this.userService.getUserFollowedRestaurants(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a single user by their MongoDB ObjectId.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId of the user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User details',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }
}
