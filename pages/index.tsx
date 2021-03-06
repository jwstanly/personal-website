import Head from 'next/head'
import HomeHeader from '../components/HomeHeader'

export default function Home() {
  return (
    <>
      <Head>
        <title>John Wright Stanly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeHeader />
    </>
  )
}
