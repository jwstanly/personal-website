import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/cjs/styles/prism/coy';

interface CodeBlockRendererProps {
  language: string;
  value: string;
}

export default function CodeBlockRenderer(props: CodeBlockRendererProps) {
  return (
    <SyntaxHighlighter
      language={props.language}
      style={style}
      showLineNumbers={false}
      wrapLines={true}
      customStyle={
        {
          fontSize: 14,
          paddingLeft: 0,
          // backgroundColor: '#000',
        } as React.CSSProperties
      }
    >
      {props.value}
    </SyntaxHighlighter>
  );
}
