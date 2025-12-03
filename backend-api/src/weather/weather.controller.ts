import { Controller, Get, Post, Body, Res, Header } from '@nestjs/common';
import type { Response } from 'express';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  create(@Body() CreateWeatherDto: CreateWeatherDto){
    console.log('Dados do Worker recebidos: ', CreateWeatherDto);
    return this.weatherService.create(CreateWeatherDto);
  }

  @Get()
  findAll() {
    return this.weatherService.findAll();
  }

  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="clima_logs.csv"')
  async exportCsv(@Res() res: Response) {
    const data = await this.weatherService.findAll();
    let csv = 'Cidade,Temperatura,Umidade,Vento,Data\n';

      data.forEach((log: any) => { 
      csv += `${log.city},${log.temperature},${log.humidity},${log.wind_speed},${log.createdAt}\n`;
    });

    res.send(csv);
  }
}
