import Link from 'next/link';
import React from 'react';
import styles from '../styles/Navbar.module.css';

interface NavbarTypes {
  color: string;
  options: NavbarOptionTypes[];
}

interface NavbarOptionTypes {
  label: string;
  href: string;
}

export default function Navbar(props: NavbarTypes){

  return (
    <div className={styles.navbarContainer}>
      <div style={{backgroundColor: props.color}}>
        <ul className={styles.navbar}>
          <h4 className={`${styles.navbarItem} ${styles.navbarBrand}`}>jwstanly.com</h4>
          {props.options.map(option => {
            return (
              <li className={styles.navbarItem}>
                <Link href={option.href} passHref>
                  <a className={styles.navbarLink}>
                    {option.label}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}