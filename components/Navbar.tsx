import Link from 'next/link';
import React from 'react';
import styles from '../styles/Navbar.module.css';
import { useRouter } from 'next/router';

interface NavbarTypes {
  color: string;
  options: NavbarOptionTypes[];
}

interface NavbarOptionTypes {
  label: string;
  href: string;
}

export default function Navbar(props: NavbarTypes) {
  const router = useRouter();

  return (
    <div className={styles.navbarContainer}>
      <div style={{ backgroundColor: props.color }}>
        <ul className={styles.navbar}>
          <li className={styles.navbarItem} style={{ float: 'left' }}>
            <Link href="/" passHref>
              <div className={styles.navbarBrand}>jwstanly.com</div>
            </Link>
          </li>

          {props.options.map(option => {
            return (
              <li
                className={styles.navbarItem}
                style={{ float: 'right' }}
                key={option.href}
              >
                <Link href={option.href} passHref>
                  <div className={styles.navbarLink}>{option.label}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
