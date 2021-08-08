import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';

interface CodeInlineRendererProps {
  children: string;
  inline: true;
  node: any;
  value: string;
  key: undefined;
}

export default function CodeInlineRenderer(props: CodeInlineRendererProps) {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={style}
      showLineNumbers={false}
      wrapLines={true}
      customStyle={
        {
          wordWrap: 'unset',
          margin: 0,
        } as React.CSSProperties
      }
      useInlineStyles={true}
      PreTag={p => (
        <span
          {...p}
          style={{
            lineHeight: '0.5em',
            fontSize: '90%',
            padding: '0.1em 0.3em 0.2em',
            margin: '0 0.05em',
            borderRadius: '0.3em',
            backgroundColor: style['pre[class*="language-"]'].background,
          }}
        />
      )}
      CodeTag={p => <span {...p} />}
    >
      {props.value}
    </SyntaxHighlighter>
  );
}
