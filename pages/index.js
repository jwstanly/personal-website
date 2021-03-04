import Head from 'next/head'
import { Container } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <Head>
        <title>John Wright Stanly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="App-body">
        <br/>
        <br/>
        <img src="/images/profileClipped.png" className="App-logo animated-1 fadeInUpFar" alt="John Wright Stanly" />
        <br/>
        <h2 className="animated-1 fadeInUp animation-delay-350">Welcome to my website</h2>
        <p className="animated-1 fadeInUp animation-delay-450">This website is currently under construction. Come back soon.</p>
      </Container>
    </>
  )
}
