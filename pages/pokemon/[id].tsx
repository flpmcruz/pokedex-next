import { useState } from 'react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Button, Card, Container, Grid, Image, Text } from '@nextui-org/react'
import confetti from 'canvas-confetti'

import { Layout } from '@/components/Layouts'
import { Pokemon } from '@/interfaces'
import { getPokemonInfo, localFavorites } from '@/utils'

interface Props {
  pokemon: Pokemon
}

const PokemonPage: NextPage<Props> = ({pokemon}) => {

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

export default PokemonPage

/* El getStaticPaths siempre necesita al getStaticProps pero no viceversa*/

export const getStaticPaths : GetStaticPaths = async (ctx) => {

  const pokemons151 = [...Array(151)].map( (value, index) => `${index + 1}`)

  return {
    paths: pokemons151.map( id => ({
      params: { id }
    })),
    //fallback: false //muestra 404 si no existe
    fallback: 'blocking' //intenta servir el contenido aunque no este generado en el server
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

  const { id } = params as { id: string}
  const pokemon = await getPokemonInfo(id)

  if(!pokemon) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      pokemon
    },
    revalidate: 86400 // In Seconds = 1d
  }
}
