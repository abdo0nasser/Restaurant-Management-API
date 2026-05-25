import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './models/user.model';
import { Follow, FollowSchema } from './models/follow.model';
import {
  Restaurant,
  RestaurantSchema,
} from '../restaurant/models/restaurant.model';
import { UserRepository } from './user.repository';
import { FollowRepository } from './follow.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, FollowRepository],
  exports: [UserService, FollowRepository],
})
export class UserModule {}
