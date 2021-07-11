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
    <div>
      <Navbar
        color="#FFF"
        options={[
          { label: 'Contact', href: '/contact' },
          { label: 'Blog', href: '/blog' },
          { label: 'Home', href: '/' },
        ]}
      />
      {children}
      <Spacer top={100} />
      <Footer />
    </div>
  );
}
