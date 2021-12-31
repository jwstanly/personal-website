import React from 'react';

interface ButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  small?: boolean;
}

export default function Button(props: ButtonProps) {
  return (
    <div
      className={
        props.small
          ? 'cursor-pointer inline-block pb-1.5 pt-0.5 px-5 text-white rounded-lg bg-gray-900 hover:bg-gray-800 focus:bg-gray-700 duration-100'
          : 'cursor-pointer inline-block py-3 px-12 text-white rounded-lg bg-gray-900 hover:bg-gray-800 focus:bg-gray-700 duration-100'
      }
      onClick={props.onPress}
    >
      <div
        className={
          props.small
            ? 'inline-block font-normal text-xs mb-0 text-center select-none text-white no-underline'
            : 'inline-block font-normal text-sm mb-0 text-center select-none text-white no-underline'
        }
      >
        {props.loading ? 'Loading' : props.text}
      </div>
    </div>
  );
}
