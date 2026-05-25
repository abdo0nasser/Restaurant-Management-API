import { Injectable } from '@nestjs/common';
import { FollowRepository } from '../user/follow.repository';
import { RestaurantRepository } from './restaurant.repository';
import {
  CreateRestaurantDto,
  ListRestaurantsQueryDto,
  NearbyRestaurantsQueryDto,
} from './dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepo: RestaurantRepository,
    private readonly followRepo: FollowRepository,
  ) {}

  async create(dto: CreateRestaurantDto) {
    return await this.restaurantRepo.create(dto);
  }

  async findAll(listResturantsDto: ListRestaurantsQueryDto) {
    return await this.restaurantRepo.findAll(
      listResturantsDto.page,
      listResturantsDto.limit,
      listResturantsDto.cuisine,
    );
  }

  async findById(id: string) {
    return await this.restaurantRepo.findById(id);
  }

  async findBySlug(slug: string) {
    return await this.restaurantRepo.findBySlug(slug);
  }

  async findNearby(nearbyRestaurantsQueryDto: NearbyRestaurantsQueryDto) {
    return await this.restaurantRepo.findNearby(
      nearbyRestaurantsQueryDto.latitude,
      nearbyRestaurantsQueryDto.longitude,
      nearbyRestaurantsQueryDto.page,
      nearbyRestaurantsQueryDto.limit,
      1000,
    );
  }

  async getMostFollowed(paginationDto: PaginationDto) {
    return await this.followRepo.findMostFollowed(
      paginationDto.page,
      paginationDto.limit,
    );
  }
}
