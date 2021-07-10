import React from 'react';

interface CenteredContainerProps {
  children: JSX.Element | JSX.Element[];
}

export default function CenteredContainer(props: CenteredContainerProps) {
  return (
    <div className="container mx-auto px-4 max-w-3xl">{props.children}</div>
  );
}
