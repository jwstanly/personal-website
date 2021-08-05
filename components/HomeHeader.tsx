import React from 'react';
import styles from '../styles/HomeHeader.module.css';

export default function HomeHeader() {
  return (
    <div
      className="flex flex-row"
      style={{
        background: '#f1f1f1',
        boxShadow: '0px 5px 10px #ddd',
        height: '30vw',
      }}
    >
      <div style={{ flex: 2, flexDirection: 'column', marginTop: '6vw' }}>
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
          style={{
            width: '20vw',
            height: '20vw',
            marginTop: '5vw',
            marginLeft: '10vw',
          }}
          src="/images/profileClipped.png"
          alt="John Wright Stanly"
        />
      </div>
    </div>
  );
}
