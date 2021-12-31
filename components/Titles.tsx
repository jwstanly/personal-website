import React from 'react';

interface TitleProps {
  centered?: boolean;
  italic?: boolean;
  underline?: boolean;

  red?: boolean;
  green?: boolean;

  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;

  children: string;
  id?: string;
}

function getCSS(props: TitleProps): React.CSSProperties {
  let css: React.CSSProperties = {
    marginTop: props.marginTop || 0,
    marginLeft: props.marginLeft || 0,
    marginBottom: props.marginBottom || 0,
    marginRight: props.marginRight || 0,
  };

  if (props.italic) {
    css.fontStyle = 'italic';
  } else if (props.underline) {
    css.textDecoration = 'underline';
  } else if (props.red) {
    css.color = '#F00';
  } else if (props.green) {
    css.color = '#49D65D';
  }

  return css;
}

export function H1(props: TitleProps) {
  return (
    <h1
      id={props.id}
      className={props.centered ? 'text-center' : ''}
      style={getCSS(props)}
    >
      {props.children}
    </h1>
  );
}

export function H2(props: TitleProps) {
  return (
    <h2
      id={props.id}
      className={props.centered ? 'text-center' : ''}
      style={getCSS(props)}
    >
      {props.children}
    </h2>
  );
}

export function H3(props: TitleProps) {
  return (
    <h3
      id={props.id}
      className={props.centered ? 'text-center' : ''}
      style={getCSS(props)}
    >
      {props.children}
    </h3>
  );
}

export function H4(props: TitleProps) {
  return (
    <h4
      id={props.id}
      className={props.centered ? 'text-center' : ''}
      style={getCSS(props)}
    >
      {props.children}
    </h4>
  );
}

export function H5(props: TitleProps) {
  return (
    <h5
      id={props.id}
      className={props.centered ? 'text-center' : ''}
      style={getCSS(props)}
    >
      {props.children}
    </h5>
  );
}

export function H6(props: TitleProps) {
  return (
    <h6
      id={props.id}
      className={props.centered ? 'text-center' : ''}
      style={getCSS(props)}
    >
      {props.children}
    </h6>
  );
}

export function Text(props: TitleProps) {
  return <p>{props.children}</p>;
}

export function Code(props: TitleProps) {
  return (
    <div
      className="float-left font-extrabold text-xs mx-0 mt-0 mb-1 pr-5 text-left"
      style={{ fontFamily: 'IBM Plex Mono', color: '#888' }}
    >
      {props.children}
    </div>
  );
}

export function Tag(props: TitleProps) {
  return (
    <div
      style={{ fontSize: 11 }}
      className="rounded-lg border-solid border border-gray-500 text-gray-500 float-left font-semibold mt-0 ml-0 mb-4 mr-5 py-1.5 px-3"
    >
      {props.children}
    </div>
  );
}
