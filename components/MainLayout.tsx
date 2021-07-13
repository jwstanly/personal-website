import React from 'react';
import styles from '../styles/Home.module.css';
import Footer from './Footer';
import Navbar from './Navbar';
import Spacer from './Spacer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  React.useEffect(() => {
    if (localStorage.getItem('userId') === null) {
      localStorage.setItem('userId', Math.random().toString(36).substr(2, 11));
    }
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div style={{ paddingBottom: '2.5rem' }}>
        <Navbar
          color="#FFF"
          options={[
            { label: 'Contact', href: '/contact' },
            { label: 'Blog', href: '/blog' },
            { label: 'Home', href: '/' },
          ]}
        />
        {children}
        <Spacer top={50} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '2.5rem',
        }}
      >
        <Footer />
      </div>
    </div>
  );
}
