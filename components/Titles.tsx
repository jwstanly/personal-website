import React, { ObjectHTMLAttributes } from 'react';
import styles from '../styles/Home.module.css';

interface TitleProps {
  centered?: boolean;
  italic?: boolean;
  underline?: boolean;

  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  children: string;
  id?: string;
}

function getCSS(props: TitleProps): React.CSSProperties {
  let css: React.CSSProperties = {
    marginTop: props.marginTop || 0,
    marginLeft: props.marginLeft || 0,
    marginBottom: props.marginBottom || 0,
    marginRight: props.marginRight || 0,
  }

  if(props.italic) {
    css.fontStyle = "italic"
  } else if(props.underline) {
    css.textDecoration = "underline"
  }

  return css;
}

export function H1(props: TitleProps){

  return (
    <h1 
      id={props.id} 
      className={props.centered ? styles.centered : ""} 
      style={getCSS(props)}
    >
      {props.children}
    </h1>
  );
}

export function H2(props: TitleProps){

  return (
    <h2 
      id={props.id} 
      className={props.centered ? styles.centered : ""} 
      style={getCSS(props)}
    >
      {props.children}
    </h2>
  );
}

export function H3(props: TitleProps){

  return (
    <h3 
      id={props.id} 
      className={props.centered ? styles.centered : ""} 
      style={getCSS(props)}
    >
      {props.children}
    </h3>
  );
}

export function H4(props: TitleProps){

  return (
    <h4
      id={props.id} 
      className={props.centered ? styles.centered : ""}
      style={getCSS(props)}
    >
      {props.children}
    </h4>
  );
}

export function H5(props: TitleProps){

  return (
    <h5 
      id={props.id} 
      className={props.centered ? styles.centered : ""}
      style={getCSS(props)}
    >
      {props.children}
    </h5>
  );
}

export function H6(props: TitleProps){

  return (
    <h6 
      id={props.id} 
      className={props.centered ? styles.centered : ""}
      style={getCSS(props)}
    >
      {props.children}
    </h6>
  );
}

export function Text(props: TitleProps){

  return (
    <p>
      {props.children}
    </p>
  );
}

export function Code(props: TitleProps){

  return (
    <div className={styles.codeText}>
      {props.children}
    </div>
  );
}

export function Tag(props: TitleProps){

  return (
    <div className={styles.tagText}>
      {props.children}
    </div>
  );
}