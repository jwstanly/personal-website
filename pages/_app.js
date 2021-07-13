import '../styles/globals.css';
import '../lib/fontAwesome';
import MainLayout from '../components/MainLayout';

function MyApp({ Component, pageProps }) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}

export default MyApp;
