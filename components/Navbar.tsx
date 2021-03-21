import Link from 'next/link';
import React from 'react';
import styles from '../styles/Navbar.module.css';
import { useRouter } from 'next/router'

interface NavbarTypes {
  color: string;
  options: NavbarOptionTypes[];
}

interface NavbarOptionTypes {
  label: string;
  href: string;
}

export default function Navbar(props: NavbarTypes){

  const router = useRouter();

  return (
    <div className={styles.navbarContainer}>
      <div style={{backgroundColor: props.color}}>
        <ul className={styles.navbar}>
          <div onClick={() => router.push('/')} className={`${styles.navbarItem} ${styles.navbarBrand}`}>jwstanly.com</div>
          {props.options.map(option => {
            return (
              <li className={styles.navbarItem} key={option.href}>
                <Link href={option.href} passHref>
                  <div className={styles.navbarLink}>
                    {option.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}