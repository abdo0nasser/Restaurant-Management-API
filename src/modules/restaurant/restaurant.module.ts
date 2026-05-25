import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { RestaurantController } from './restaurant.controller';
import { Restaurant, RestaurantSchema } from './models/restaurant.model';
import { RestaurantRepository } from './restaurant.repository';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
    UserModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantRepository],
})
export class RestaurantModule {}
