import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { handleDbError } from '../../common/errors/db-error-handler';
import { DuplicateEntityError } from '../../common/errors/domain-errors';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/models/restaurant.model';
import { User, UserDocument } from './models/user.model';
import { Follow, FollowDocument } from './models/follow.model';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(userId: string, restaurantId: string): Promise<FollowDocument> {
    try {
      const [user, restaurant] = await Promise.all([
        this.userModel.findById(userId).exec(),
        this.restaurantModel.findById(restaurantId).exec(),
      ]);
      if (!user) throw new NotFoundException('User not found');
      if (!restaurant) throw new NotFoundException('Restaurant not found');

      return await this.followModel.create({
        user: new Types.ObjectId(userId),
        restaurant: new Types.ObjectId(restaurantId),
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if ((error as { code: number }).code === 11000) {
        throw new DuplicateEntityError('Already following this restaurant');
      }
      handleDbError(error, 'create follow');
    }
  }

  async deleteOne(userId: string, restaurantId: string): Promise<void> {
    try {
      const result = await this.followModel
        .deleteOne({
          user: new Types.ObjectId(userId),
          restaurant: new Types.ObjectId(restaurantId),
        })
        .exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('Follow relation not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      handleDbError(error, 'delete follow');
    }
  }

  async findByUser(userId: string): Promise<FollowDocument[]> {
    try {
      return await this.followModel
        .find({ user: new Types.ObjectId(userId) })
        .populate('restaurant')
        .exec();
    } catch (error) {
      handleDbError(error, 'find follows by user');
    }
  }

  async findMostFollowed(
    page: number,
    limit: number,
  ): Promise<{ _id: string; count: number }[]> {
    try {
      const skip = limit * (page - 1);
      return await this.followModel
        .aggregate([
          { $group: { _id: '$restaurant', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          {
            $lookup: {
              from: 'restaurants',
              localField: '_id',
              foreignField: '_id',
              as: 'restaurant',
            },
          },
          { $unwind: '$restaurant' },
          {
            $project: {
              _id: '$restaurant._id',
              arName: '$restaurant.arName',
              enName: '$restaurant.enName',
              slug: '$restaurant.slug',
              cuisines: '$restaurant.cuisines',
              count: 1,
            },
          },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec();
    } catch (error) {
      handleDbError(error, 'find most followed');
    }
  }
}
