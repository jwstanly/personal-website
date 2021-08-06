import React from 'react';
import styles from '../styles/HomeHeader.module.css';

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
        <div>
          <img
            className={styles.imageContainer}
            src="/images/profileClipped.png"
            alt="John Wright Stanly"
          />
        </div>
      </div>
      {/* <div className={styles.container}>
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
        <div style={{ flex: 1.14 }}>
          <img
            className={styles.imageContainer}
            src="/images/profileClipped.png"
            alt="John Wright Stanly"
          />
        </div>
      </div> */}
    </>
  );
}
