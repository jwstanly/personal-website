import React from 'react';
import Spacer from './Spacer';

interface CheckBoxProps {
  value: boolean;
  setValue: (t: boolean) => void;
  label?: string;
  optional?: boolean;
  required?: boolean;
}

export default function CheckBox(props: CheckBoxProps) {
  return (
    <div className="mb-6">
      <div>
        <label htmlFor={props.label}>
          {`
            ${props.label}
            ${props.optional ? '(Optional)' : ''}
            ${props.required ? '(Required)' : ''}
          `}
        </label>
        <Spacer top={7} />
      </div>
      <input
        type="checkbox"
        checked={props.value}
        onChange={() => props.setValue(!props.value)}
      />
    </div>
  );
}
