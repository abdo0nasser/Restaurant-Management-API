import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import slugify from 'slugify';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema({ timestamps: true, versionKey: false })
export class Restaurant {
  @Prop({ required: true })
  arName!: string;

  @Prop({ required: true })
  enName!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({
    required: true,
    type: [String],
    validate: {
      validator: (v: string[]) => v.length >= 1 && v.length <= 3,
      message: 'Cuisines must have between 1 and 3 items',
    },
  })
  cuisines!: string[];

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location!: {
    type: string;
    coordinates: number[];
  };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.pre<RestaurantDocument>('save', function () {
  if (this.isModified('enName') || this.isNew) {
    this.slug = slugify(this.enName, { lower: true, strict: true });
  }
});

RestaurantSchema.index({ location: '2dsphere' });
