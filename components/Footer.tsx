import Link from 'next/link';
import React from 'react';
import styles from '../styles/Home.module.css';
import CenteredContainer from './CenteredContainer';

export default function Footer(){

  return (
    <footer>
      <CenteredContainer>
        <Link href='https://github.com/jwstanly/personal-website' passHref>
          <p className={styles.footerContent}>
            Designed, built, and deployed by John Wright Stanly
          </p>
        </Link>
      </CenteredContainer>
    </footer>
  );
}