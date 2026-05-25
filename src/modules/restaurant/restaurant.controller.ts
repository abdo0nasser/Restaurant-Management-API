import {
  Body,
  Controller,
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
import { RestaurantService } from './restaurant.service';
import {
  CreateRestaurantDto,
  RestaurantResponseDto,
  ListRestaurantsQueryDto,
  NearbyRestaurantsQueryDto,
  MostFollowedItemDto,
  FollowerCountDto,
} from './dto';
import { PaginationDto } from 'src/common/pagination.dto';

@ApiTags('Restaurants')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a new restaurant',
    description:
      'Creates a restaurant with bilingual names, cuisines, and geolocation. The slug is auto-generated from the English name.',
  })
  @ApiBody({ type: CreateRestaurantDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Restaurant created successfully',
    type: RestaurantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Missing or invalid JWT token',
  })
  async create(@Body() createResturantDto: CreateRestaurantDto) {
    return await this.restaurantService.create(createResturantDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all restaurants',
    description: 'Returns all restaurants. Optionally filter by cuisine type.',
  })
  @ApiQuery({
    name: 'cuisine',
    required: false,
    example: 'Burgers',
    description: 'Filter by cuisine (e.g. "Burgers")',
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
    description: 'List of restaurants',
    type: [RestaurantResponseDto],
  })
  async findAll(@Query() listRestaurantsQueryDto: ListRestaurantsQueryDto) {
    return await this.restaurantService.findAll(listRestaurantsQueryDto);
  }

  @Get('id/:id')
  @ApiOperation({
    summary: 'Get restaurant details',
    description: 'Retrieves a restaurant by its MongoDB ObjectId or URL slug.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the restaurant',
    example: '6a1251d6ad009691c141c6b6',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant details',
    type: RestaurantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  async findById(@Param('id') id: string) {
    return await this.restaurantService.findById(id);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Find nearby restaurants',
    description:
      'Returns restaurants within a given radius (default 1KM) from a geographic point using MongoDB geospatial queries.',
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
    description: 'List of nearby restaurants',
    type: [RestaurantResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid coordinates',
  })
  async findNearby(
    @Query() nearbyRestaurantsQueryDto: NearbyRestaurantsQueryDto,
  ) {
    return await this.restaurantService.findNearby(nearbyRestaurantsQueryDto);
  }

  @Get('most-followed')
  @ApiOperation({
    summary: 'Most followed restaurants',
    description: 'Returns restaurants ranked by follower count.',
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
    description: 'List of restaurants with follower counts',
    type: [MostFollowedItemDto],
  })
  async getMostFollowed(@Query() paginationDto: PaginationDto) {
    return await this.restaurantService.getMostFollowed(paginationDto);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get restaurant details',
    description: 'Retrieves a restaurant by its MongoDB ObjectId or URL slug.',
  })
  @ApiParam({
    name: 'slug',
    description: 'slug string of the restaurant name',
    example: 'pizza-hut',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant details',
    type: RestaurantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Restaurant not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    return await this.restaurantService.findBySlug(slug);
  }
}
