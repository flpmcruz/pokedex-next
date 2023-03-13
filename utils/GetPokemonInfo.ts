import { pokeApi } from "@/api"
import { Pokemon } from "@/interfaces"

export const getPokemonInfo = async (query:string) => {

    const { data } = await pokeApi.get<Pokemon>(`/pokemon/${query}`)
  
    const pokemon = {
      id: data.id,
      name: data.name,
      sprites: data.sprites
    }

    return pokemon
}