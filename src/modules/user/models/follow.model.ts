import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({ timestamps: true, versionKey: false })
export class Follow {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant' })
  restaurant!: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// first index to make sure that no user follows a restaurant twice(and an index on the user btw)
// second for queries on restaurant side
FollowSchema.index({ user: 1, restaurant: 1 }, { unique: true });
FollowSchema.index({ restaurant: 1 });
