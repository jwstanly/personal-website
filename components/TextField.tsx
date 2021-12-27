import React from 'react';
import Spacer from './Spacer';

interface TextFieldProps {
  type?: string;
  value: string;
  setValue: (t: string) => void;
  label?: string;
  onEnter?: () => void;
  placeholder?: string;
  optional?: boolean;
  required?: boolean;
  lines?: number;
}

export default function TextField(props: TextFieldProps) {
  function enterAction(e) {
    if (props.onEnter && e.key === 'Enter') {
      props.onEnter();
    }
  }

  const style: React.DetailedHTMLProps<any, any> = {
    className:
      'bg-white rounded border-solid border p-2 resize-none w-full border border-transparent focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent',
    style: {
      borderColor: '#dddddd',
    },
  };

  return (
    <div className="mb-6">
      <div>
        <label>
          {`
            ${props.label}
            ${props.optional ? '(Optional)' : ''}
            ${props.required ? '(Required)' : ''}
          `}
        </label>
        <Spacer top={7} />
      </div>
      {props.lines > 1 ? (
        <textarea
          {...style}
          rows={props.lines}
          value={props.value}
          onInput={e => props.setValue((e.target as HTMLTextAreaElement).value)}
        />
      ) : (
        <div>
          <input
            {...style}
            type={props.type || 'text'}
            value={props.value}
            onInput={e =>
              props.setValue((e.target as HTMLTextAreaElement).value)
            }
            onKeyPress={enterAction}
            placeholder={props.placeholder}
            autoComplete={props.type || undefined}
          />
        </div>
      )}
    </div>
  );
}
