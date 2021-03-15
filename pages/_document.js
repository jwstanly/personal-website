import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />

        <link 
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link 
          href='https://fonts.googleapis.com/css?family=Montserrat:thin,extra-light,light,100,200,300,400,500,600,700,800'
          rel='stylesheet'
          type='text/css'
        />
        <link 
          href='https://fonts.googleapis.com/css?family=Inter:thin,extra-light,light,100,200,300,400,500,600,700,800'
          rel='stylesheet'
          type='text/css'
        />
        <link 
          href='https://fonts.googleapis.com/css?family=IBM+Plex+Mono'
          rel='stylesheet'
          type='text/css'
        />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument