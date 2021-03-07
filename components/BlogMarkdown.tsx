import React from 'react';
import styles from '../styles/Home.module.css';

interface BlogMarkdownProps {
  children: string;
}

export function BlogMarkdown(props: BlogMarkdownProps){

  return (
    <p className={styles.contentText}>
      {props.children}
    </p>
  );
}