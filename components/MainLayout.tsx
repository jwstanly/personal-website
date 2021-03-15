import React from 'react';
import styles from '../styles/Home.module.css';
import Footer from './Footer';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
};

export default function MainLayout({children}: MainLayoutProps){

  return (
    <div>
      <Navbar 
        color="#FFF"
        options={[
          {label: "Contact", href: "/#contact"},
          {label: "Blog", href: "/blog"},
          {label: "Home", href: "/"},
        ]}
      />
      {children}
      <Footer />
    </div>

  );
}