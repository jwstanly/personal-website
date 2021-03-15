import Link from 'next/link';
import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/Home.module.css';

export default function Footer(){

  return (
    <footer>
      <Link href='https://github.com/jwstanly/personal-website' passHref>
        <p className={styles.footerContent}>
          Designed, built, and deployed by John Wright Stanly
        </p>
      </Link>
    </footer>
  );
}