import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll(@Query('page') page: string) {
  return this.pokemonService.findAll(+page || 1);
}
}