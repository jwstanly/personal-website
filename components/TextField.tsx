import React from "react";
import styles from '../styles/Form.module.css';

interface TextFieldProps {
  type: string;
  value: string;
  setValue: (string)=>void;
  label?: string;
  onEnter?: ()=>void;
};

export default function TextField(props: TextFieldProps) {
  
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
      <div className={styles.formInput}>
        <input 
          type={props.type}
          value={props.value}
          onInput={e => props.setValue((e.target as HTMLTextAreaElement).value)}
          onKeyPress={enterAction}  
        />
      </div>
    </div>

  );
}
