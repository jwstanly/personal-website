import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/Home.module.css';

interface TitleProps {
  children: string;
  style?: object;
}

export function H1(props: TitleProps){

  return (
    <h1 className={styles.title}>
      {props.children}
    </h1>
  );
}

export function H2(props: TitleProps){

  return (
    <h2 className={styles.subtitle}>
      {props.children}
    </h2>
  );
}

export function H3(props: TitleProps){

  return (
    <h3 className={styles.h3title}>
      {props.children}
    </h3>
  );
}

export function H4(props: TitleProps){

  return (
    <h3 className={styles.h3title}>
      {props.children}
    </h3>
  );
}

export function H5(props: TitleProps){

  return (
    <h3 className={styles.h3title}>
      {props.children}
    </h3>
  );
}

export function H6(props: TitleProps){

  return (
    <h3 className={styles.h3title}>
      {props.children}
    </h3>
  );
}

export function Text(props: TitleProps){

  return (
    <p className={styles.contentText} style={props.style}>
      {props.children}
    </p>
  );
}

export function Code(props: TitleProps){

  return (
    <p className={styles.codeText} style={props.style}>
      {props.children}
    </p>
  );
}