import { Injectable } from '@nestjs/common';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Model } from 'mongoose';
import { Weather, type WeatherDocument } from './entities/weather.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class WeatherService {
  constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>) {}

  async create(CreateWeatherDto: CreateWeatherDto){
    const temp = CreateWeatherDto.temperature;
    let insight = "Clima normal";

    if(temp > 30) insight = "Muito Calor!! Evite exposição prolongada e mantenha-se hidratado!";
    else if (temp < 15) insight = "Clima de Frio detectado! vista seu casaco";
    else if (CreateWeatherDto.humidity < 30) insight= "Umidade Baixa";


    const createdWeather = new this.weatherModel({
      ...CreateWeatherDto,
      ai_insight: insight,
    });
    return createdWeather.save();
  }

  async findAll(){
    return this.weatherModel.find().sort({createdAt: -1}).limit(100).exec();
  }



}
