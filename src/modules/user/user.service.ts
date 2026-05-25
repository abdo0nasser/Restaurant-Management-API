import { ConflictException, Injectable } from '@nestjs/common';
import { hashPassword } from '../../common/utils/crypto';
import { UserRepository } from './user.repository';
import { FollowRepository } from './follow.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly followRepo: FollowRepository,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepo.findByEmail(email);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const hashed = await hashPassword(dto.password);
    return await this.userRepo.create({ ...dto, password: hashed });
  }

  async findAll() {
    return await this.userRepo.findAll();
  }

  async findById(id: string) {
    return await this.userRepo.findById(id);
  }

  async followRestaurant(userId: string, restaurantId: string) {
    return await this.followRepo.create(userId, restaurantId);
  }

  async unfollowRestaurant(userId: string, restaurantId: string) {
    return await this.followRepo.deleteOne(userId, restaurantId);
  }

  async getUserFollowedRestaurants(userId: string) {
    const follows = await this.followRepo.findByUser(userId);
    return follows.map((f) => f.restaurant);
  }

  async recommend(userId: string, paginationDto: PaginationDto) {
    const user = await this.userRepo.findById(userId);

    const recommendations =
      await this.userRepo.findSimilarUsersWithFollowedRestaurants(
        user._id,
        user.favoriteCuisines,
        paginationDto.page,
        paginationDto.limit,
      );

    return recommendations;
  }
}
