import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './models/restaurant.model';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly model: Model<RestaurantDocument>,
  ) {}

  async create(
    data: Pick<Restaurant, 'arName' | 'enName' | 'cuisines' | 'location'>,
  ): Promise<RestaurantDocument> {
    return await this.model.create(data);
  }

  async findAll(cuisine?: string): Promise<RestaurantDocument[]> {
    const filter = cuisine ? { cuisines: cuisine } : {};
    return await this.model.find(filter).exec();
  }

  async findById(id: string): Promise<RestaurantDocument | null> {
    return await this.model.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<RestaurantDocument | null> {
    return await this.model.findOne({ slug }).exec();
  }

  async findByIdOrSlug(idOrSlug: string): Promise<RestaurantDocument> {
    const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
    const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    const restaurant = await this.model.findOne(filter).exec();
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async findNearby(
    latitude: number,
    longitude: number,
    maxDistance: number,
  ): Promise<RestaurantDocument[]> {
    return await this.model
      .find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [longitude, latitude] },
            $maxDistance: maxDistance,
          },
        },
      })
      .exec();
  }
}
