import React from 'react';
import styles from '../styles/HomeHeader.module.css';

export default function HomeHeader(){
  return (
    <div className={styles.header} id="home">
      <div style={{flex: 2, flexDirection: 'column', marginTop: '7vw'}}>
        <h1 className={`${styles.headerFirstLineText} ${styles.greyGradientText}`}>
          Hey, I'm
        </h1>
        <h1 className={`${styles.headerSecondLineText} ${styles.colorGradientText}`}>
          John Wright
        </h1>
      </div>
      <div style={{flex:1.2}}>
        <img
          style={{width: '20vw', height: '20vw', marginTop: '5vw', marginLeft: '10vw'}}
          src="/images/profileClipped.png" 
          alt="John Wright Stanly"
        />
      </div>
    </div>
  );
}