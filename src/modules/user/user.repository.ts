import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './models/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.model.findOne({ email }).exec();
  }

  async create(
    data: Pick<User, 'email' | 'password' | 'fullName' | 'favoriteCuisines'>,
  ): Promise<UserDocument> {
    return await this.model.create(data);
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.model.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.model.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findSimilarUsersWithFollowedRestaurants(
    userId: Types.ObjectId,
    favoriteCuisines: string[],
  ) {
    return await this.model
      .aggregate([
        {
          $match: {
            _id: { $ne: userId },
            favoriteCuisines: { $in: favoriteCuisines },
          },
        },
        {
          $lookup: {
            from: 'follows',
            localField: '_id',
            foreignField: 'user',
            as: 'follows',
          },
        },
        { $unwind: '$follows' },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'follows.restaurant',
            foreignField: '_id',
            as: 'restaurant',
          },
        },
        { $unwind: '$restaurant' },
        {
          $group: {
            _id: '$_id',
            fullName: { $first: '$fullName' },
            favoriteCuisines: { $first: '$favoriteCuisines' },
            restaurants: { $addToSet: '$restaurant' },
          },
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            favoriteCuisines: 1,
            restaurants: 1,
          },
        },
      ])
      .exec();
  }
}
