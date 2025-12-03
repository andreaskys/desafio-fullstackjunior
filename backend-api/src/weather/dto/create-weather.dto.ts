import { IsString, IsNumber, IsNotEmpty, IsOptional} from 'class-validator';

export class CreateWeatherDto {

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsNumber()
  @IsNotEmpty()
  humidity: number;

  @IsNumber()
  @IsNotEmpty()
  wind_speed: number;

  @IsNumber()
  @IsNotEmpty()
  condition_code: number;

  @IsString()
  @IsNotEmpty()
  timestamp: string; 

  @IsString()
  @IsOptional()
  ai_insight?: string;

}
