import { useEffect, useState } from 'react';

import { Layout } from '@/components/Layouts'
import { NoFavorites } from '@/components/ui'
import { localFavorites } from '@/utils';
import { FavoritePokemons } from '@/components/pokemons/FavoritePokemons';

const FavoritesPage = () => {

  const [favoritePokemons, setFavoritePokemons] = useState<number[]>([])

  useEffect(() => {
    setFavoritePokemons(localFavorites.pokemons())
  }, [])

  return (
    <Layout title='Favorites'>

      {
        favoritePokemons.length === 0 
          ? <NoFavorites />
          : <FavoritePokemons pokemons={favoritePokemons} />
      }

    </Layout>
  )
}

export default FavoritesPage
