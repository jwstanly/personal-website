import React from "react";

interface SpacerProps {
  top?: number,
  bottom?: number,
  left?: number,
  right?: number,
}

export default function Spacer(props: SpacerProps) {

  const margins: React.CSSProperties = {
    marginTop: props.top || 0,
    marginLeft: props.left || 0,
    marginBottom: props.bottom || 0,
    marginRight: props.right || 0,
  }

  return <div style={margins} />
}