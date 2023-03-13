import { FunctionComponent, PropsWithChildren } from "react"
import Head from "next/head"
import { Navbar } from "../ui"

interface Props {
  title?: string
}

const origin = (typeof window === 'undefined') ? '' : window.location.origin

export const Layout: FunctionComponent<PropsWithChildren<Props>> = ({ children, title }) => {

  return (
    <>
      <Head>
        <title>{title || 'PokemonApp'}</title>
        <meta name="author" content="Felipe Mireles" />
        <meta name="description" content="Sobre el Pokemon AAAA" />
        <meta name="keywords" content="ABC" />
        <meta property="og:title" content={`Informacion sobre ${title}`} />
        <meta property="og:description" content={`Informacion sobre ${title}`} />
        <meta property="og:image" content={`${origin}/img/banner.png`} />
      </Head>

      <Navbar />

      <main style={{
        padding: '0px 20px'
      }}>
        {children}
      </main>
    </>
  )
}
