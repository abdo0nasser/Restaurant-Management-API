import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { handleDbError } from '../../common/errors/db-error-handler';
import { EntityNotFoundError } from '../../common/errors/domain-errors';
import { User, UserDocument } from './models/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      handleDbError(error, 'find user by email');
    }
  }

  async create(
    data: Pick<User, 'email' | 'password' | 'fullName' | 'favoriteCuisines'>,
  ): Promise<UserDocument> {
    try {
      return await this.userModel.create(data);
    } catch (error) {
      handleDbError(error, 'create user');
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      handleDbError(error, 'find users');
    }
  }

  async findById(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new EntityNotFoundError('User', id);
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      handleDbError(error, 'find user by id');
    }
  }

  async findSimilarUsersWithFollowedRestaurants(
    userId: Types.ObjectId,
    favoriteCuisines: string[],
    page: number,
    limit: number,
  ) {
    try {
      const skip = (page - 1) * limit;
      const result = await this.userModel
        .aggregate([
          /*
           * Stage 1: $match
           * - Exclude the current user
           * - Keep only users who have at least one of the requested cuisines
           * - paginated
           */
          {
            $match: {
              _id: { $ne: userId },
              favoriteCuisines: { $in: favoriteCuisines },
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          /*
           * Stage 2: $lookup (follows)
           * - Join with `follows` collection to fetch follow documents for each user
           * - Results are placed into an array field `follows`
           */
          {
            $lookup: {
              from: 'follows',
              localField: '_id',
              foreignField: 'user',
              as: 'follows',
            },
          },

          /*
           * Stage 3: $unwind
           * - Turn each element of the `follows` array into its own document so
           *   we can deduplicate restaurant ids easily with $addToSet in the next stage.
           * - `preserveNullAndEmptyArrays: true` keeps users with no follows
           *   (they produce a document with `follows: null`) so they aren't dropped.
           */
          { $unwind: { path: '$follows', preserveNullAndEmptyArrays: true } },

          /*
           * Stage 4: $group
           * - Combine all documents into a single summary document (`_id: null`)
           * - `users` uses $addToSet to collect unique user summaries (deduplicates
           *   the same user who appears multiple times after unwind)
           * - `restaurantIds` collects unique restaurant ObjectIds from follows
           */
          {
            $group: {
              _id: null,
              users: {
                $addToSet: {
                  _id: '$_id',
                  fullName: '$fullName',
                  favoriteCuisines: '$favoriteCuisines',
                },
              },
              restaurantIds: { $addToSet: '$follows.restaurant' },
            },
          },

          /*
           * Stage 5: $project
           * - Remove any nulls from restaurantIds (users without follows may
           *   have contributed `null` because of preserveNullAndEmptyArrays)
           */
          {
            $project: {
              users: 1,
              restaurantIds: {
                $filter: {
                  input: '$restaurantIds',
                  as: 'id',
                  cond: { $ne: ['$$id', null] },
                },
              },
            },
          },

          /*
           * Stage 6: $lookup (restaurants)
           * - Fetch the full restaurant documents for the deduplicated ids
           */
          {
            $lookup: {
              from: 'restaurants',
              localField: 'restaurantIds',
              foreignField: '_id',
              as: 'restaurants',
            },
          },

          /*
           * Final projection: hide the grouped _id and expose only users + restaurants
           */
          {
            $project: {
              _id: 0,
              users: 1,
              restaurants: 1,
            },
          },
        ])
        .exec();

      return result[0] || { users: [], restaurants: [] };
    } catch (error) {
      handleDbError(error, 'find recommendations');
    }
  }
}
