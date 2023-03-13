import { useState } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Button, Card, Container, Grid, Image, Text } from '@nextui-org/react'
import confetti from 'canvas-confetti'

import { Layout } from '@/components/Layouts'
import { pokeApi } from '@/api'
import { Pokemon, PokemonListResponse } from '@/interfaces'
import { getPokemonInfo, localFavorites } from '@/utils'

interface Props {
  pokemon: Pokemon
}

const PokemonByNamePage: NextPage<Props> = ({pokemon}) => {

  const [isInFavorite, setIsInFavorite] = useState(localFavorites.existInFavorites(pokemon.id) || false)

  const onToggleFavorite = () => {
    localFavorites.toggleFavorites( pokemon.id )
    setIsInFavorite(!isInFavorite)

    if(isInFavorite) return

    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      angle: -100,
      origin: {
        x: 1, 
        y: 0,
      }
    })
  }

  return (
    <Layout title={pokemon.name}>
        <Grid.Container css={{ marginTop: '5px'}} gap={2}>
          <Grid xs={12} sm={4}>
            <Card isHoverable css={{ padding: '30px' }}>
              <Card.Body>
                <Card.Image
                  src={pokemon.sprites.other?.dream_world.front_default || 'no-image'}
                  alt={pokemon.name}
                  width="100%"
                  height={200}
                />
              </Card.Body>
            </Card>
          </Grid>

          <Grid xs={12} sm={8}>
            <Card>
              <Card.Header css={{ display: 'flex', justifyContent: 'space-between'}}>
                <Text h1 transform='capitalize'>{pokemon.name}</Text>

                <Button
                  color="gradient"
                  ghost={!isInFavorite}
                  onClick={onToggleFavorite}
                >
                  {isInFavorite ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                </Button>
              </Card.Header>

              <Card.Body>
                <Text size={30}>Sprites:</Text>
                <Container direction='row' display='flex' gap={0}>
                  <Image
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={pokemon.sprites.back_default}
                    alt={pokemon.name}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={pokemon.sprites.front_shiny}
                    alt={pokemon.name}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={pokemon.sprites.back_shiny}
                    alt={pokemon.name}
                    width={100}
                    height={100}
                  />
                </Container>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
    </Layout>
  )
}

export default PokemonByNamePage


export const getStaticPaths: GetStaticPaths = async (ctx) => {

  //Conseguir los 151 nombres en un array******
  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151')
  const pokemonsName: string[] = data.results.map( poke => poke.name)

  return {
    paths: pokemonsName.map( name => ({
      params: { name }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

  const { name } = params as { name: string}
  const pokemon = await getPokemonInfo(name)

  return {
    props: {
      pokemon
    }
  }
}
