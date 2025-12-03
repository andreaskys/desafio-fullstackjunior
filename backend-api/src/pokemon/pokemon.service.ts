import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PokemonService {
  private readonly BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

  async findAll(page: number = 1) {
    const limit = 20;
    const offset = (page - 1) * limit;

    const response = await axios.get(`${this.BASE_URL}?limit=${limit}&offset=${offset}`);

    const results = response.data.results;

    const detailedPokemons = await Promise.all(
      results.map(async (pokemon: any) => {
        const detail = await axios.get(pokemon.url);
        return {
          name: pokemon.name,
          image: detail.data.sprites.front_default,
          types: detail.data.types.map((t: any) => t.type.name).join(', '),
          id: detail.data.id
        };
      })
    );

    return detailedPokemons;
  }
}