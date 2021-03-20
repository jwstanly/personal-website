import React from 'react';

interface LargeIconProps {
  imageUrl: string;
  alt: string;
}

export function LargeIcon(props: LargeIconProps){

  return (
    <img
      style={{
        borderRadius: 20,
        maxWidth: 120,
        width: 120,
        boxShadow: '0px 0px 40px 5px #CCC'
      }}
      src={props.imageUrl}
      alt={props.alt}
    />
  );
}