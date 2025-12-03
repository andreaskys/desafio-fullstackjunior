export interface WeatherData {
  _id: string;
  city: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  condition_code: number;
  ai_insight?: string;
  timestamp: string;
  createdAt: string;
}