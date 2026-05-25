import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleDbError } from '../../common/errors/db-error-handler';
import { EntityNotFoundError } from '../../common/errors/domain-errors';
import { Restaurant, RestaurantDocument } from './models/restaurant.model';

type CreateRestaurantData = Pick<
  Restaurant,
  'arName' | 'enName' | 'cuisines'
> & {
  latitude: number;
  longitude: number;
};

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(data: CreateRestaurantData): Promise<RestaurantDocument> {
    try {
      return await this.restaurantModel.create({
        arName: data.arName,
        enName: data.enName,
        cuisines: data.cuisines,
        location: {
          type: 'Point',
          coordinates: [data.longitude, data.latitude],
        },
      });
    } catch (error) {
      handleDbError(error, 'create restaurant');
    }
  }

  async findAll(
    page: number,
    limit: number,
    cuisine?: string,
  ): Promise<RestaurantDocument[]> {
    try {
      const skip = limit * (page - 1);
      const filter = cuisine ? { cuisines: cuisine } : {};
      return await this.restaurantModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      handleDbError(error, 'find restaurants');
    }
  }

  async findById(id: string): Promise<RestaurantDocument> {
    try {
      const restaurant = await this.restaurantModel.findById(id).exec();
      if (!restaurant) throw new EntityNotFoundError('Restaurant', id);
      return restaurant;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      handleDbError(error, 'find restaurant by id');
    }
  }

  async findBySlug(slug: string): Promise<RestaurantDocument> {
    try {
      const restaurant = await this.restaurantModel.findOne({ slug }).exec();
      if (!restaurant) throw new EntityNotFoundError('Restaurant', slug);
      return restaurant;
    } catch (error) {
      if (error instanceof EntityNotFoundError) throw error;
      handleDbError(error, 'find restaurant by slug');
    }
  }

  async findNearby(
    latitude: number,
    longitude: number,
    page: number,
    limit: number,
    maxDistance: number,
  ): Promise<RestaurantDocument[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.restaurantModel
        .find({
          location: {
            $near: {
              $geometry: { type: 'Point', coordinates: [longitude, latitude] },
              $maxDistance: maxDistance,
            },
          },
        })
        .limit(limit)
        .skip(skip)
        .exec();
    } catch (error) {
      handleDbError(error, 'find nearby restaurants');
    }
  }
}
