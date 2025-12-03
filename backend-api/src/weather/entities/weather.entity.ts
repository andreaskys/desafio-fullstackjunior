import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type WeatherDocument = HydratedDocument<Weather>;

@Schema({timestamps: true})
export class Weather{
  @Prop()
  city: string;

  @Prop()
  temperature: number;

  @Prop()
  humidity: number;

  @Prop()
  wind_speed: number;

  @Prop()
  condition_code: number;

  @Prop()
  timestamp: string;

  @Prop({required: false})
  ai_insight: string;
}


export const WeatherSchema = SchemaFactory.createForClass(Weather);