import React from 'react';
import styles from '../styles/Home.module.css';
import Spacer from './Spacer';


interface LikeDislikePanelProps {
  likes: number;
  dislikes: number;
}

export function LikeDislikePanel(props: LikeDislikePanelProps){



  return (
    <div style={{display: 'flex', justifyContent: 'stretch'}}>
      <p className={styles.likeText}>{props.likes}</p>
      <svg viewBox="-60 -30 350 300" className={styles.likeButton}>
        <path d="M7.67,93.896h52.077V215.34H7.67V93.896z M207.67,106.682c-7.189-7.189-14.382-14.379-21.572-21.57h-41.451l9.877-25.102  l2.801-7.119l-0.258-2.049L151,2.33L121.115,0L110.15,37.822L80.954,85.176V215.34h107.89L207.67,106.682z" />
      </svg>
      <Spacer left={10} />
      <p className={styles.likeText}>{props.dislikes}</p>
      <svg viewBox="-60 -30 350 300" className={styles.likeButton} style={{transform: 'rotate(180deg)'}}>
        <path d="M7.67,93.896h52.077V215.34H7.67V93.896z M207.67,106.682c-7.189-7.189-14.382-14.379-21.572-21.57h-41.451l9.877-25.102  l2.801-7.119l-0.258-2.049L151,2.33L121.115,0L110.15,37.822L80.954,85.176V215.34h107.89L207.67,106.682z" />
      </svg>
    </div>
  );
}