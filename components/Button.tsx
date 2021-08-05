import React from 'react';
import styles from '../styles/Home.module.css';

interface ButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <div
      className={`cursor-pointer inline-block py-3 px-12 text-white rounded-lg bg-gray-900 hover:bg-gray-800 duration-100`}
      onClick={props.onPress}
    >
      <div className={styles.buttonText}>
        {props.loading ? 'Loading' : props.text}
      </div>
    </div>
  );
}
