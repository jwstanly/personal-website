import React from 'react';
import styles from '../styles/Form.module.css';

interface TextAreaProps {
  value: string;
  setValue: (string) => void;
  label?: string;
  lines?: number;
  onEnter?: () => void;
}

export default function TextArea(props: TextAreaProps) {
  function enterAction(e) {
    if (props.onEnter && e.key === 'Enter') {
      props.onEnter();
    }
  }

  return (
    <div className={styles.formRow}>
      <div className={styles.formLabel}>
        <label>{props.label}</label>
      </div>
      <div className={styles.textAreaComment}>
        <textarea
          rows={props.lines || 3}
          className={styles.textAreaInput}
          value={props.value}
          onInput={e => props.setValue((e.target as HTMLTextAreaElement).value)}
        />
      </div>
    </div>
  );
}
