import React from 'react';
import styles from '../styles/HomeHeader.module.css';
import profilePic from '../public/images/profilePicYellowstone.jpg';
import Image from 'next/image';

export default function HomeHeader() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <div
            className={`${styles.headerFirstLineText} ${styles.greyGradientText}`}
          >
            Hey, I'm
          </div>
          <div
            className={`${styles.headerSecondLineText} ${styles.colorGradientText}`}
          >
            John Wright
          </div>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={profilePic}
            alt="Picture of John Wright Stanly, the owner of this blog"
            priority
            className="rounded-full"
          />
        </div>
      </div>
    </>
  );
}
