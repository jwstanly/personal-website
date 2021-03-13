import React from "react";
import styles from '../styles/Home.module.css';

interface ButtonProps {
  text: string;
  onPress: ()=>void;
  loading?: boolean;
};

export default function Button(props: ButtonProps) {

  return (
    <div className={styles.button} onClick={props.onPress}>
      <div className={styles.buttonText}>
        {props.loading ? "Loading" : props.text}
      </div>
    </div>
  );
}
