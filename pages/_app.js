import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import MainLayout from '../components/MainLayout';

function MyApp({ Component, pageProps }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp
