import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow, FollowDocument } from './models/follow.schema';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectModel(Follow.name) private readonly model: Model<FollowDocument>,
  ) {}

  async create(
    data: Pick<Follow, 'user' | 'restaurant'>,
  ): Promise<FollowDocument> {
    return await this.model.create(data);
  }

  async deleteOne(data: Pick<Follow, 'user' | 'restaurant'>): Promise<void> {
    await this.model.deleteOne(data).exec();
  }

  async findByUser(data: Pick<Follow, 'user'>): Promise<FollowDocument[]> {
    return await this.model.find(data).populate('restaurant').exec();
  }

  async countByRestaurant(restaurantId: Types.ObjectId): Promise<number> {
    return await this.model.countDocuments({ restaurant: restaurantId }).exec();
  }

  async findMostFollowed(): Promise<{ _id: string; count: number }[]> {
    return await this.model
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
      ])
      .exec();
  }
}
