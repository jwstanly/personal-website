import React from 'react';

interface LargeIconProps {
  imageUrl: string;
  alt: string;
}

export function LargeIcon(props: LargeIconProps) {
  return (
    <img
      className="rounded-3xl w-36 h-36 max-w-xl m-0 mt-2 object-cover"
      style={{
        boxShadow: '0px 0px 40px 5px #CCC',
        height: '9rem',
        width: '9rem',
      }}
      src={props.imageUrl}
      alt={props.alt}
    />
  );
}
